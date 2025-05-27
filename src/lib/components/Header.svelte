<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/state'
	import { goto } from '$app/navigation'
	import { getPhotoUrl } from '$lib/pocketbase.svelte'
	import Openmoji from './Openmoji.svelte'

	let selectedText = $state('')

	function getSelectedText() {
		const selection = window.getSelection()
		const text = selection && selection.toString().trim()
		selectedText = text || ''
	}

	function handleSearchClick() {
		if (selectedText) {
			const encoded = encodeURIComponent(selectedText)
			goto(`/search?q=${encoded}`)
		} else {
			goto('/search')
		}
	}

	onMount(() => {
		document.addEventListener('selectionchange', getSelectedText)
		return () => {
			document.removeEventListener('selectionchange', getSelectedText)
		}
	})

	const headers = [
		{ link: '/my', name: 'about' },
		{ link: '/posts', name: 'posts' },
		{ link: '/projects', name: 'projects' },
		{ link: '/contact', name: 'contact' },
	]

	const showHeader = $derived.by(() => {
		const hideUrls = ['/blahblah']
		if (hideUrls.includes(page.url.pathname)) return false
		return true
	})

	const user = $derived(page.data?.user)
	const isProject = $derived(page.data?.post?.[0]?.category.includes('project') || false)
	const isAbout = $derived(page.data?.post?.[0]?.category.includes('meta') || false)
	// all projects are posts, but we don't want them included for marking headers active
	const isPost = $derived(
		(page.data?.post?.[0]?.format === 'post' && !isProject && !isAbout) || false,
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
					header.link === page.url.pathname ||
					(isAbout && header.link === '/my/story') ||
					(isPost && header.link === '/posts') ||
					(isProject && header.link === '/projects')}
				<a class:active href={header.link}>{header.name}</a>
			{/each}

			<button
				aria-label="Search"
				onclick={handleSearchClick}
				title={selectedText ? `Search for "${selectedText}"` : 'Search'}
				data-umami-event={selectedText ? `Search for "${selectedText}"` : 'Search'}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-search-icon lucide-search"
				>
					<path d="m21 21-4.34-4.34" />
					<circle cx="11" cy="11" r="8" />
				</svg>
			</button>
			{#if user}
				<a href="/admin">
					{#if user.avatar}
						<img alt="Avatar of {user.name}" src={getPhotoUrl(user)} />
					{:else}
						<!-- width should match css for img	-->
						<Openmoji id="1FAB7" width="2rem" />
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
	button {
		margin: 0;
		padding: 0;
		background-color: unset;

		&:hover {
			background-color: unset;
		}
		svg {
			color: var(--lightFaded);
		}
		svg:hover {
			color: var(--accentFaded);
		}
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
