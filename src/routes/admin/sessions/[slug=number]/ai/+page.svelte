<script lang="ts">
	import { t } from 'svelte-i18n';
	import { onMount, onDestroy } from 'svelte';
	import { pb } from '$lib/client/pocketbase';
	import {
		ArrowLeft,
		BrainCircuit,
		Check,
		X,
		ShieldAlert,
		Zap,
		Flag,
		ChevronDown,
		ChevronUp,
	} from 'lucide-svelte';

	import type { AiLog } from '$types/pocketBase/TableTypes';

	let { data } = $props();

	let aiLogs: AiLog[] = $state(data.aiLogs);
	let expandedNodes: Set<string> = $state(new Set());

	// Group AI logs by node ID for easy lookup
	const logsByNode = $derived.by(() => {
		const map = new Map<string, AiLog[]>();
		for (const log of aiLogs) {
			const existing = map.get(log.node) || [];
			existing.push(log);
			map.set(log.node, existing);
		}
		return map;
	});

	// Only show contribution nodes (not events or startNode)
	const contributions = $derived(
		data.nodes.filter((n: any) => n.type === 'contribution')
	);

	function toggleNode(nodeId: string) {
		const next = new Set(expandedNodes);
		if (next.has(nodeId)) {
			next.delete(nodeId);
		} else {
			next.add(nodeId);
		}
		expandedNodes = next;
	}

	function getSideName(sideId: string | null): string {
		if (!sideId) return '';
		const side = data.sides.find((s: any) => s.id === sideId);
		return side?.name || '';
	}

	function formatDate(date: string | Date): string {
		return new Date(date).toLocaleString();
	}

	// Real-time subscription
	let unsubAiLog: (() => void) | null = null;
	let unsubNode: (() => void) | null = null;

	onMount(async () => {
		await pb.collection('AiLog').subscribe('*', ({ action, record }) => {
			if (action === 'create' && record.session === data.session.id) {
				aiLogs = [...aiLogs, record as unknown as AiLog];
			}
		});
		unsubAiLog = () => pb.collection('AiLog').unsubscribe('*');

		await pb.collection('Node').subscribe('*', ({ action, record }) => {
			if (action === 'create' && record.session === data.session.id) {
				data.nodes = [...data.nodes, record];
			}
		});
		unsubNode = () => pb.collection('Node').unsubscribe('*');
	});

	onDestroy(() => {
		unsubAiLog?.();
		unsubNode?.();
	});
</script>

<div class="min-h-screen bg-black text-gray-100 p-4 sm:p-8 max-w-4xl mx-auto">
	<!-- Header -->
	<div class="mb-8">
		<a href="/admin" class="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white mb-4">
			<ArrowLeft class="w-4 h-4" />
			{$t('admin.administration')}
		</a>

		<div class="flex items-center justify-between flex-wrap gap-4">
			<div>
				<h1 class="text-2xl font-bold flex items-center gap-2">
					<BrainCircuit class="w-6 h-6 text-purple-400" />
					{$t('ia.dashboard')}
				</h1>
				<p class="text-gray-400 mt-1">
					{data.session.name} &mdash; {data.scenario.title}
				</p>
			</div>

			<div class="flex gap-3">
				<!-- Session status -->
				{#if data.session.completed}
					<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-green-900 text-green-300">
						<Check class="w-3.5 h-3.5" />
						{$t('ia.sessionCompleted')}
					</span>
				{:else}
					<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-amber-900 text-amber-300">
						{$t('ia.sessionInProgress')}
					</span>
				{/if}
				<!-- AI status -->
				{#if data.scenario.ai}
					<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-purple-900 text-purple-300">
						<BrainCircuit class="w-3.5 h-3.5" />
						{$t('ia.aiActive')}
					</span>
				{:else}
					<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-gray-800 text-gray-400">
						{$t('ia.aiInactive')}
					</span>
				{/if}
			</div>
		</div>
	</div>

	<!-- Timeline -->
	<div class="space-y-2">
		{#if contributions.length === 0}
			<p class="text-gray-500 text-center py-8">{$t('ia.notEvaluated')}</p>
		{:else}
			{#each contributions as node (node.id)}
				{@const nodeId = String(node.id)}
				{@const logs = logsByNode.get(nodeId) || []}
				{@const isExpanded = expandedNodes.has(nodeId)}
				{@const hasLogs = logs.length > 0}
				{@const sideName = getSideName(node.side)}

				<div class="border border-gray-800 rounded-lg overflow-hidden">
					<!-- Node header -->
					<button
						onclick={() => toggleNode(nodeId)}
						class="w-full flex items-center justify-between p-3 hover:bg-gray-900 transition-colors text-left"
					>
						<div class="flex items-center gap-3 min-w-0">
							<div class="flex flex-col min-w-0">
								<span class="font-medium truncate">{node.title}</span>
								<span class="text-xs text-gray-500">
									{node.author}
									{#if sideName}
										&middot; {sideName}
									{/if}
									&middot; {formatDate((node as any).created)}
								</span>
							</div>
						</div>
						<div class="flex items-center gap-2 shrink-0">
							<!-- Quick badges -->
							{#if !hasLogs}
								<span class="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-500">{$t('ia.notEvaluated')}</span>
							{:else}
								{#each logs as aiLog}
									{#if aiLog.capability === 'trigger'}
										{#if aiLog.matched}
											<span class="text-xs px-2 py-0.5 rounded bg-green-900 text-green-300">
												<Zap class="w-3 h-3 inline" /> {$t('ia.rule')} {aiLog.ruleIndex}
											</span>
										{/if}
									{:else if aiLog.capability === 'end'}
										{#if aiLog.matched}
											<span class="text-xs px-2 py-0.5 rounded bg-orange-900 text-orange-300">
												<Flag class="w-3 h-3 inline" /> {$t('ia.sessionEnded')}
											</span>
										{/if}
									{:else if aiLog.capability === 'censor'}
										{#if aiLog.matched}
											<span class="text-xs px-2 py-0.5 rounded bg-red-900 text-red-300">
												<ShieldAlert class="w-3 h-3 inline" /> {$t('ia.censored')}
											</span>
										{/if}
									{/if}
								{/each}
							{/if}
							{#if isExpanded}
								<ChevronUp class="w-4 h-4 text-gray-500" />
							{:else}
								<ChevronDown class="w-4 h-4 text-gray-500" />
							{/if}
						</div>
					</button>

					<!-- Expanded detail -->
					{#if isExpanded}
						<div class="border-t border-gray-800 p-3 space-y-3 bg-gray-950">
							<!-- Node text -->
							<p class="text-sm text-gray-300 italic">"{node.text}"</p>

							{#if !hasLogs}
								<p class="text-sm text-gray-500">{$t('ia.notEvaluated')}</p>
							{:else}
								{#each logs as aiLog}
									<div class="flex items-start gap-2 text-sm">
										<!-- Icon -->
										{#if aiLog.capability === 'trigger'}
											<Zap class="w-4 h-4 mt-0.5 shrink-0 {aiLog.matched ? 'text-green-400' : 'text-gray-600'}" />
										{:else if aiLog.capability === 'end'}
											<Flag class="w-4 h-4 mt-0.5 shrink-0 {aiLog.matched ? 'text-orange-400' : 'text-gray-600'}" />
										{:else if aiLog.capability === 'censor'}
											<ShieldAlert class="w-4 h-4 mt-0.5 shrink-0 {aiLog.matched ? 'text-red-400' : 'text-gray-600'}" />
										{/if}

										<div class="min-w-0">
											<!-- Capability label + match status -->
											<div class="flex items-center gap-2">
												<span class="font-medium {aiLog.matched ? 'text-white' : 'text-gray-500'}">
													{#if aiLog.capability === 'trigger'}
														{#if aiLog.matched}
															{$t('ia.triggered')}: {$t('ia.rule')} {aiLog.ruleIndex}
														{:else}
															{$t('ia.triggerRules')}: {$t('ia.noMatch')}
														{/if}
													{:else if aiLog.capability === 'end'}
														{#if aiLog.matched}
															{$t('ia.sessionEnded')}
														{:else}
															{$t('ia.endCondition')}: {$t('ia.noMatch')}
														{/if}
													{:else if aiLog.capability === 'censor'}
														{#if aiLog.matched}
															{$t('ia.censored')}
														{:else}
															{$t('ia.clean')}
														{/if}
													{/if}
												</span>
												{#if aiLog.matched}
													<Check class="w-3.5 h-3.5 text-green-400" />
												{:else}
													<X class="w-3.5 h-3.5 text-gray-600" />
												{/if}
											</div>

											<!-- Reason -->
											{#if aiLog.reason}
												<p class="text-gray-400 mt-0.5">{$t('ia.reason')}: {aiLog.reason}</p>
											{/if}

											<!-- Original text for censor -->
											{#if aiLog.capability === 'censor' && aiLog.matched && (aiLog.originalTitle || aiLog.originalText)}
												<details class="mt-1">
													<summary class="text-gray-500 cursor-pointer text-xs hover:text-gray-300">{$t('ia.originalText')}</summary>
													<div class="mt-1 p-2 bg-gray-900 rounded text-xs">
														{#if aiLog.originalTitle}
															<p><span class="text-gray-500">title:</span> {aiLog.originalTitle}</p>
														{/if}
														{#if aiLog.originalText}
															<p><span class="text-gray-500">text:</span> {aiLog.originalText}</p>
														{/if}
													</div>
												</details>
											{/if}
										</div>
									</div>
								{/each}
							{/if}
						</div>
					{/if}
				</div>
			{/each}
		{/if}
	</div>
</div>
