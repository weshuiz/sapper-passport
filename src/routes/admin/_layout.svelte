<script context="module">
    import { hasAdmin } from '../../util'
	export async function preload(page, session) {
		const { csrfToken, loggedIn, user } = session// get csrf token from session (set by sapper middleware see server.js)
        if(loggedIn && hasAdmin(user)) {
            return {}
        }else {
            return this.redirect(302, '/')// user not authorized redirect to 'home'
        }
	}
</script>
