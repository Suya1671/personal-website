<script module lang="ts">
export interface IProject {
    description: string
    name: string
    url: string
}
</script>

<script lang="ts">
    interface Props {
        project: IProject;
    }
    const { project }: Props = $props();
</script>

<a class="box-border decoration-none group h-full rounded-2xl" href={project.url}>
    <div
        class="flex bg-light-mantle box-border dark:bg-dark-mantle flex-col gap-2 h-full items-center justify-between pa-2 rounded-xl"
    >
        <h2
            class="dark:from-dark-sapphire dark:text-dark-text dark:to-dark-mauve dark:via-dark-lavender from-light-sapphire group-hover:bg-clip-text group-hover:bg-gradient-to-br group-hover:casl group-hover:text-transparent ma-0 text-3xl text-center text-light-text to-light-mauve transition-all via-light-lavender"
        >
            {project.name}
        </h2>
        <p class="dark:text-dark-text ma-0 text-center text-light-text text-xl">
            {project.description}
        </p>
        <div class="flex flex-col mb-2 space-y-2">
            <span
                class="bg-transparent dark:outline-dark-maroon dark:text-dark-text decoration-none group-hover:(bg-light-maroon group-hover:dark:bg-dark-maroon group-hover:dark:text-dark-mantle group-hover:visited:dark:text-dark-mantle outline outline-0 outline-light-maroon pa-2 rounded-xl text-2xl text-center text-light-mantle text-light-text text-xl tracking-wider transition-all visited:dark:text-dark-text visited:text-light-mantle) visited:text-light-text"
            >
                Learn more →
            </span>
        </div>
    </div>
</a>
