document.addEventListener('DOMContentLoaded', async function () {
    // Get username from the URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    const accessToken = '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';

    try {
        document.getElementById('loader').style.display = 'block';
        // Fetch user details and repositories concurrently   ##########  additionally used to load repositories fastly
        const [userResponse, repoResponse] = await Promise.all([
            fetch(`https://api.github.com/users/${username}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }),
            fetch(`https://api.github.com/users/${username}/repos`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
        ]);
        document.getElementById('loader').style.display = 'none';
        // Process user details
        const user = await userResponse.json();
        document.getElementById('userAvatar').src = user.avatar_url;
        document.getElementById('userName').innerText = user.login;
        document.getElementById('userBio').innerText = user.bio;
        document.getElementById('userLocation').innerText = user.location || 'Location not specified';
        document.getElementById('userTwitterLink').innerText = `https://twitter.com/${user.twitter_username}`;
        document.getElementById('userTwitterLink').href = `https://twitter.com/${user.twitter_username}`;
        document.getElementById('userGitHubLink').innerText = `https://github.com/${user.login}`;
        document.getElementById('userGitHubLink').href = user.html_url;

        // Process repositories
        const repos = await repoResponse.json();
        const repositories = document.getElementById('repositories');
        let current_page = 1;
        let total_pages = Math.ceil(repos.length / 2); // Assuming 2 repositories per page

        createPages(current_page);

        function createPages(current_page) {
            repositories.innerHTML = "";

            for (let i = (current_page - 1) * 2; i < current_page * 10 && i < repos.length; i += 2) {
                const row = document.createElement('div');
                row.classList.add('repo-row');

                for (let j = i; j < i + 2 && j < repos.length; j++) {
                    const repo = repos[j];
                    const repoBox = document.createElement('div');
                    repoBox.classList.add('repo-box');

                    const repoLink = document.createElement('a');
                    repoLink.href = repo.html_url;
                    repoLink.target = '_blank';
                    repoLink.textContent = repo.name;

                    repoBox.appendChild(repoLink);

                    repoBox.innerHTML += `
                        <p>${repo.description || 'No description available'}</p>
                        <p>Language: ${repo.language || 'Not specified'}</p>
                        <p>Stars: ${repo.stargazers_count}</p>
                    `;

                    row.appendChild(repoBox);
                }

                repositories.appendChild(row);
            }
        }

        function loadPreviousPage() {
            if (current_page > 1) {
                current_page--;
                createPages(current_page);
               
            }
        }

        function loadNextPage() {
            if (current_page < total_pages) {
                current_page++;
                createPages(current_page);
                // window.scrollTo(0, 0);
            }
        }

        // Add event listeners for the buttons
        document.getElementById('loadPreviousBtn').addEventListener('click', loadPreviousPage);
        document.getElementById('loadNextBtn').addEventListener('click', loadNextPage);

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('loader').style.display = 'none';
    }

    document.getElementById('usernameForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        window.location.href = `main.html?username=${username}`;
    });
});
