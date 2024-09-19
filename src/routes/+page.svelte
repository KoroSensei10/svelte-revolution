<script lang="ts">
	import { t } from 'svelte-i18n';
	import { tasks, type Task } from '$lib/taskProgress';

	tasks.sort((a, b) => Number(a.order) - Number(b.order));

	let [completed, total] = sumTaskDuration(tasks);

	function sumTaskDuration(tasks: Task[]): number[] {
		let duration = tasks.reduce(
			(acc, task) => {
				if (task.completed) acc[0] = acc[0] + task.duration;
				acc[1] = acc[1] + task.duration;
				return acc;
			},
			[0, 0]
		);
		tasks.map((task) => {
			if (task.subTasks?.length) {
				let d = sumTaskDuration(task.subTasks);
				duration[0] += d[0];
				duration[1] += d[1];
			}
		});
		return duration;
	}
</script>

<div class="flex flex-col items-center w-full gap-4 py-4 mb-4">
	<h1 class="text-3xl font-thin text-white">Svelte Révolution Roadmap</h1>
	<div class="flex flex-col items-center gap-2">
		<progress class="w-56 progress progress-accent border" value={completed} max={total} />
		<span class="text-white">
			{completed} / {total} points ({Math.round((completed / total) * 100)}%)
		</span>
	</div>
	<div class="flex flex-col items-center w-full gap-2">
		{#each tasks as task (task.taskName)}
			<div
				class="w-full sm:w-2/3 md:w-1/2 bg-black even:bg-slate-900 border rounded text-gray-200 {task.subTasks
					?.length
					? 'collapse'
					: ''}"
			>
				{#if task.subTasks?.length}
					<input type="checkbox" class="" checked name={task.taskName} />
				{/if}
				<h2 class="flex items-center justify-between w-full px-4 justify-items-center collapse-title">
					<span class="mr-2 {task.completed ? 'line-through' : ''}">
						<span class="mr-2">{task.taskName}</span>
						<span class="badge badge-primary">{task.inCharge ?? "L'invité mystère"}</span>
					</span>
					<span class="ml-2 badge badge-success">
						{task.duration
							? task.duration
							: task.subTasks?.reduce((acc, subTask) => acc + subTask.duration, 0)} points
					</span>
				</h2>
				{#if task.subTasks?.length}
					<div class="flex flex-col w-full gap-2 pl-8 pr-4 collapse-content">
						{#each task.subTasks as subTask (subTask.taskName)}
							<h3 class="flex items-center justify-between w-full">
								<span class="mr-2 {subTask.completed ? 'line-through' : ''}">{subTask.taskName}</span>
								<span class="border-b border-dashed grow"></span>
								<span class="ml-2 badge badge-info text-nowrap">
									{subTask.duration} points
								</span>
							</h3>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>
