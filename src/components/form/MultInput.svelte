<script lang="ts">
	export let props: {
		name: string;
		title: string;
		titleName: string;
		textName: string;
		placeholderTitle: string;
		placeholderText: string;
	};
</script>

<div class="flex flex-col items-center p-2">
	<div class="w-full">
		<label for={props.name} class="text-lg font-thin">{props.titleName}</label>
		<input
			required
			name={props.name}
			placeholder={props.placeholderTitle}
			class="w-full p-4 border-b placeholder:font-thin placeholder:italic focus:border-white"
		/>
	</div>
	<div class="w-full">
		<label for={props.name + '-text'} class="text-lg font-thin">{props.textName}</label>
		<textarea
			rows="3"
			required
			name={props.name + '-text'}
			placeholder={props.placeholderText}
			class="w-full p-4 border-b placeholder:font-thin placeholder:italic focus:border-white"
		></textarea>
	</div>
</div>
