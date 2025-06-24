<script lang="ts">
    import dark from '$lib/pictures/interestsToProjectsDark.svg?url';
    import light from '$lib/pictures/interestsToProjectsLight.svg?url';
</script>

<div
    class="spacer"
    style={`--light-transition: url(${light}); --dark-transition: url(${dark});`}
></div>

<style>
    .spacer {
        aspect-ratio: 960 / 150;

        background-image: light-dark(var(--light-transition), var(--dark-transition));
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
    }
</style>
