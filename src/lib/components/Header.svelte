<script lang="ts">
	import { page } from '$app/stores'
	import { getPhotoUrl } from '$lib/pocketbase.svelte'
	import Openmoji from './Openmoji.svelte'

	const headers = [
		{ link: '/my', name: 'about' },
		{ link: '/posts', name: 'posts' },
		{ link: '/projects', name: 'projects' },
		{ link: '/contact', name: 'contact' },
	]

	const showHeader = $derived.by(() => {
		const hideUrls = ['/blahblah']
		if (hideUrls.includes($page.url.pathname)) return false
		return true
	})

	const user = $derived($page.data?.user)
	const isProject = $derived($page.data?.post?.[0]?.category.includes('project') || false)
	const isAbout = $derived($page.data?.post?.[0]?.category.includes('meta') || false)
	// all projects are posts, but we don't want them included for marking headers active
	const isPost = $derived(
		($page.data?.post?.[0]?.format === 'post' && !isProject && !isAbout) || false,
	)
</script>

<header>
	{#if showHeader}
		<span id="site">
			<a href="/" id="sitename">adam.nz</a>
		</span>

		<span>
			{#each headers as header}
				{@const active =
					header.link === $page.url.pathname ||
					(isAbout && header.link === '/my/story') ||
					(isPost && header.link === '/posts') ||
					(isProject && header.link === '/projects')}
				<a class:active href={header.link}>{header.name}</a>
			{/each}

			{#if user}
				<a href="/admin">
					{#if user.avatar}
						<img alt="Avatar of {user.name}" src={getPhotoUrl(user)} />
					{:else}
						<Openmoji id="1FAB7" />
					{/if}
				</a>
			{/if}
		</span>
	{/if}
</header>

<style>
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;

		margin-block: 0.5rem;
		margin-inline: auto;

		font-size: 1.2rem;
		font-weight: 600;
	}
	span {
		display: flex;
		align-items: center;
		justify-content: right;
		gap: 0.7rem;
	}
	a {
		text-decoration: none;
		color: var(--lightFaded);
	}
	a:hover {
		color: var(--accentFaded);
	}
	.active {
		/* color: var(--accentFaded); */
		text-decoration-line: overline;
		text-decoration-style: solid;
		text-decoration-color: var(--accentFaded);
		text-decoration-thickness: 3px;
	}
	a.active:hover {
		color: var(--lightFaded);
	}
	img {
		width: 2rem;
		border-radius: 50%;
	}

	@media (max-width: 768px) {
		#site {
			display: none;
		}

		span {
			justify-content: center;
		}
	}
</style>
