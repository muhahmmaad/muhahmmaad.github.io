/**
 * GitHub OAuth helper for Decap CMS on GitHub Pages.
 *
 * GitHub Pages serves static files only, so it cannot perform the OAuth token
 * exchange (which requires sending a client secret from a server). This Worker
 * is that server, and nothing else: it redirects to GitHub, swaps the returned
 * code for a token, and hands the token back to the CMS window.
 *
 * Deploy on Cloudflare Workers (free tier) and set two secrets:
 *   GITHUB_CLIENT_ID
 *   GITHUB_CLIENT_SECRET
 *
 * See CMS-SETUP.md in this folder for the full walkthrough.
 */

// Only these origins may receive a token. Add a custom domain here if you
// point one at the site later.
const ALLOWED_ORIGINS = [
  'https://muhahmmaad.github.io',
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/callback') {
      return handleCallback(request, url, env);
    }

    // Anything else starts the flow.
    return handleAuth(url, env);
  },
};

function handleAuth(url, env) {
  // Single-user shortcut: a repo token on the Worker is enough for this
  // personal site. The token is only postMessage'd back to ALLOWED_ORIGINS.
  if (env.GITHUB_TOKEN && !env.GITHUB_CLIENT_ID) {
    return postMessageResponse({ token: env.GITHUB_TOKEN, provider: 'github' });
  }

  if (!env.GITHUB_CLIENT_ID) {
    return new Response('GITHUB_CLIENT_ID is not set on this Worker.', { status: 500 });
  }

  // `state` guards against CSRF: GitHub echoes it back and we compare.
  const state = crypto.randomUUID();

  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
  authorize.searchParams.set('scope', 'repo,user');
  authorize.searchParams.set('redirect_uri', `${url.origin}/callback`);
  authorize.searchParams.set('state', state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorize.toString(),
      // HttpOnly so page scripts can't read it; SameSite=Lax survives the
      // redirect back from github.com.
      'Set-Cookie': `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`,
    },
  });
}

async function handleCallback(request, url, env) {
  const code = url.searchParams.get('code');
  const returnedState = url.searchParams.get('state');

  if (!code) {
    return postMessageResponse({ error: 'No code returned by GitHub.' });
  }

  const cookie = getCookie(request, 'oauth_state');
  if (!returnedState || !cookie || returnedState !== cookie) {
    return postMessageResponse({ error: 'State mismatch — possible CSRF. Try again.' });
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': 'portfolio-cms-auth',
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${url.origin}/callback`,
    }),
  });

  const data = await tokenRes.json();

  if (data.error || !data.access_token) {
    return postMessageResponse({ error: data.error_description || 'Token exchange failed.' });
  }

  return postMessageResponse({ token: data.access_token, provider: 'github' });
}

/**
 * Decap opens this Worker in a popup and listens for a postMessage of the form
 * "authorization:github:success:<json>". This returns the page that sends it.
 */
function postMessageResponse(payload) {
  const status = payload.error ? 'error' : 'success';
  const body = JSON.stringify(payload.error ? { message: payload.error } : payload);
  const message = `authorization:github:${status}:${body}`;

  const html = `<!DOCTYPE html>
<html><body>
<p>${payload.error ? 'Login failed. You can close this window.' : 'Signing you in…'}</p>
<script>
(function () {
  var message = ${JSON.stringify(message)};
  var allowed = ${JSON.stringify(ALLOWED_ORIGINS)};

  function send(e) {
    // Only ever hand the token to an origin we trust.
    if (allowed.indexOf(e.origin) === -1) return;
    window.removeEventListener('message', send);
    e.source.postMessage(message, e.origin);
  }

  window.addEventListener('message', send, false);

  // Decap waits for this handshake before sending its own message.
  if (window.opener) {
    allowed.forEach(function (origin) {
      window.opener.postMessage('authorizing:github', origin);
    });
  }
})();
</script>
</body></html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

function getCookie(request, name) {
  const header = request.headers.get('Cookie') || '';
  const match = header.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)'));
  return match ? match[1] : null;
}
