<script lang="ts">
	let { data, form } = $props()
</script>

<ul data-sveltekit-preload-data="false">
	<li><a href="/admin/add">Add Content</a></li>
	<li><a href="/admin/posts">Manage Posts</a></li>
	<li><a href="/admin/comments">Manage Comments</a></li>
	<li><a data-sveltekit-preload-data="false" href="/z/clientError">Trigger Client Error</a></li>
	<li><a data-sveltekit-preload-data="false" href="/z/serverError">Trigger Server Error</a></li>
</ul>
