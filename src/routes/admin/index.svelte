<script context="module">
    import { hasAdmin } from '../../util'
	export function preload(page, session) {
    const { csrfToken, loggedIn, user } = session// get csrf token from session (set by sapper middleware in server.js)
        if( loggedIn && hasAdmin(user) ){
            return { csrfToken, loggedIn, user }// authorized
        }else {
            return this.redirect(302, '/')// user not authorized redirect to 'home'
        }
	}
</script>

<h2>if you read this</h2>
<p>you are authorized</p>