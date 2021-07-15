<script>
	import { hasAdmin } from '../util'
	export let segment;
	import { stores } from '@sapper/app'
	const { session } = stores()
	$: ({ loggedIn } = $session);
	$: ({ user } = $session);

	function logout() {
		fetch('/auth/logout')
		.then(_response => {
			$session.user = undefined// logout user on the client
			$session.loggedIn = false// logout user on the client
		})
	}
</script>

<style>
	nav {
		border-bottom: 1px solid rgba(255,62,0,0.1);
		font-weight: 300;
		padding: 0 1em;
		display: flex;
		justify-content: space-between;
	}

	ul {
		margin: 0;
		padding: 0;
	}

	/* clearfix */
	ul::after {
		content: '';
		display: block;
		clear: both;
	}

	li {
		display: block;
		float: left;
	}

	.active {
		position: relative;
		display: inline-block;
	}

	.active::after {
		position: absolute;
		content: '';
		width: calc(100% - 1em);
		height: 2px;
		background-color: rgb(255,62,0);
		display: block;
		bottom: -1px;
	}

	a {
		text-decoration: none;
		padding: 1em 0.5em;
		display: block;
	}
</style>

<nav>
	<ul>
			<li><a class:active={segment === undefined} href=".">home</a></li>
			<li><a class:active={segment === 'about'} href="about">about</a></li>

			<!-- for the blog link, we're using rel=prefetch so that Sapper prefetches
				the blog data when we hover over the link or tap it on a touchscreen -->
			<li><a rel=prefetch class:active={segment === 'blog'} href="blog">blog</a></li>
			
			{#if loggedIn && hasAdmin(user)}
				<li><a class:active={segment === 'admin'} href="admin">admin</a></li>
			{/if}
	</ul>

	<ul>
		{#if loggedIn}
		<li>
			<a on:click|preventDefault={logout} href="/">logout</a>
		</li>
		{:else}
			<li><a href="login">login</a></li>
			<li><a href="register">register</a></li>
		{/if}
	</ul>
</nav>
