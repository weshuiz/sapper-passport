<!--scripts with context="module" always load first and before the page gets loaded -->
<script context="module">
	export function preload(page, session) {
    const { csrfToken, loggedIn, user } = session// get csrf token from session (set by sapper middleware in server.js)
        if(loggedIn) {
            return this.redirect(302, '/')// user not authorized redirect to 'home'
        }else {
            return { csrfToken, loggedIn, user }// authorized
        }
	}
</script>

<script>
    import { goto, stores } from "@sapper/app"
    const { session } = stores()//session store
    export let csrfToken
    let email,password,err

    async function login() {
        const input = { email, password, "_csrf": csrfToken }
        fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(input),
            })
            .then(response => response.json())
            .then(data => {
                if(data.message) {
                    err = data.message
                }else {
                    $session.user = data.user //data.user;// save user in sapper session
                    $session.loggedIn = data.loggedIn
                    goto('/')
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
</script>

{#if err}
    <p>{err}</p>
{/if}


<form on:submit|preventDefault={login}>
    <input type="hidden" name="_csrf" value={csrfToken}>

   <label for="mail">
        email
        <input bind:value={email} required id="mail" name="email" type="email" placeholder="example@email.com">
    </label>
    
    <label for="passw">
        password
        <input bind:value={password} required id="passw" name="password" type="password" placeholder="enter your password">
        <small>must contain at least: 1 special character, 1 uppercase, 1 lowercase, 1 number, 1 special character</small>
    </label>

    <p>no account? <a href="register">signup</a></p>
    <button type="submit">login</button>
</form>

<style>
    label {
        display: contents;
    }
</style>
