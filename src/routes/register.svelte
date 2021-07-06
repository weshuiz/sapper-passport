<!--scripts context="module" always runs before the page is loaded -->
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
    import { goto } from '@sapper/app';
    export let csrfToken
    let name,lastName,email,password,repeat,err

    async function register() {
        const response = await fetch("/auth/register", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            mode: 'same-origin',
            cache: 'no-cache'
            },
            body: JSON.stringify({
                name,
                lastName,
                email,
                password,
                repeat,
                "_csrf": csrfToken
            }),
        });
        const data = await response.json()// get user OR error from server
        if(data.message) {
            err = data.message
        }else {
            goto('/login')
        }
    }
</script>

{#if err}
    <p>{err}</p>
{/if}

<form on:submit|preventDefault={register}>
    <input type="hidden" name="_csrf" value={csrfToken}>

    <label for="name">name
        <input bind:value={name} required id="name" name="name" placeholder="enter your name">
    </label>

   <label for="surname">
       last name
       <input bind:value={lastName} required id="surname" name="lastName" placeholder="enter your last name">
   </label>

   <label for="mail">
        email
        <input bind:value={email} required id="mail" name="email" type="email" placeholder="example@email.com">
    </label>
    
    <label for="passw">
        password
        <input bind:value={password} required id="passw" name="password" type="password" placeholder="confirm password">
        <small>must contain at least: 1 special character, 1 uppercase, 1 lowercase, 1 number, 1 special character</small>
    </label>

    <label for="repeat">
        repeat password
        <input bind:value={repeat} required id="repeat" name="repeat" type="password" placeholder="enter your password">
    </label>

    <p>already have a account? <a href="login">login</a></p>
    <button type="submit">register</button>
</form>

<style>
    label {
        display: contents;
    }
</style>