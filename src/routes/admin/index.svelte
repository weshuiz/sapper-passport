<script context="module">
    import { hasAdmin } from '../../util'
	export function preload(page, session) {
    const { csrfToken, loggedIn, user } = session// get csrf token from session (set by sapper middleware in server.js)
        return { csrfToken, loggedIn, user }// authorized
	}
</script>

<h2>if you read this</h2>
<p>you are authorized</p>
