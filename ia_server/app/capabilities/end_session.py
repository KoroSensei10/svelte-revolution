"""LLM-driven end-condition capability.

Asks Mistral whether the contribution satisfies the configured end condition.
If so, sets `Session.completed = true` and `Session.end = <End.id>`.
"""

from __future__ import annotations

import logging
from typing import Any

from .. import state
from ..mistral_client import chat_json
from ..models import AIConfig, NodeRecord
from ..pb_client import PBClient

log = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are an AI Game Master for a collaborative storytelling platform.
Decide whether the player's contribution satisfies the scenario's end condition.

Respond ONLY with a JSON object of this exact shape, no extra text:
{"matched": <true|false>, "reason": "<short explanation>"}

IMPORTANT: The "reason" field must always be specific and reference concrete details
from the player's contribution. Never give generic reasons like "no match" or
"condition not met". Instead, briefly describe WHAT the player actually said or did,
then explain WHY it does or does not satisfy the end condition.
Example: "The player proposes a ceasefire, which is a diplomatic move — not a
declaration of total war or betrayal."."""


def _build_user_prompt(condition: str, node: NodeRecord) -> str:
	return (
		f"End condition:\n  {condition}\n\n"
		f"Player contribution:\n  title: {node.title}\n  text: {node.text}"
	)


async def run(
	node: NodeRecord,
	config: AIConfig,
	session: dict[str, Any],
	scenario: dict[str, Any],
	pb: PBClient,
) -> None:
	end_cfg = config.script.endCondition
	if end_cfg is None:
		return
	if session.get("completed"):
		return
	if await state.has_fired(node.session, ("end", 0)):
		return

	parsed = await chat_json(SYSTEM_PROMPT, _build_user_prompt(end_cfg.condition, node))
	if not parsed:
		log.warning("End: Mistral returned no parseable JSON for node %s", node.id)
		return
	log.info("End: Mistral verdict for node %s — matched=%s reason=%s", node.id, parsed.get("matched"), parsed.get("reason"))
	if not parsed.get("matched"):
		await pb.create_ai_log({
			"node": node.id,
			"session": node.session,
			"capability": "end",
			"matched": False,
			"reason": parsed.get("reason", ""),
		})
		return

	scenario_id = scenario.get("id")
	if not scenario_id:
		log.warning("End: scenario record missing id")
		return

	end_id = await pb.find_end_id(scenario_id, end_cfg.endTitle)
	if not end_id:
		log.warning(
			"End: End record %r not found for scenario %s",
			end_cfg.endTitle,
			scenario_id,
		)
		return

	try:
		await pb.update_session(node.session, {"completed": True, "end": end_id})
		log.info("End: session %s ended with end %s", node.session, end_id)
		await state.mark_fired(node.session, ("end", 0))
		await pb.create_ai_log({
			"node": node.id,
			"session": node.session,
			"capability": "end",
			"matched": True,
			"reason": parsed.get("reason", ""),
		})
	except Exception as e:  # noqa: BLE001
		log.error("End: failed to update session %s: %s", node.session, e)
