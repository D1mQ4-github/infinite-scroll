document.addEventListener('DOMContentLoaded', function() {
    const $container = document.querySelector('[data-infinite-container]'),
        blackList = [],
        loadStep = 10;

    let contentHeight = 0,
        loadCurrent = 0,
        content = [];

    async function getResoures(url) {
        const result = await fetch(url, {
            method: 'GET',
            header: {
                'Content-Type': 'application/json'
            }
        }).then(data => data.json());

        return await result;
    }

    function createPost(data) {
        const article = document.createElement('article'),
            articleInner = `
                <header class="article-header">
                    <h2 class="article-heading">${data.title}</h2>
                    <p class="article-description">${data.body}</p>
                </header>

                <footer class="article-footer">
                    <a href="#" class="article-button">See More</a>
                </footer>
                `;

        article.classList.add('article');

        article.innerHTML = articleInner;

        return article;
    }

    function renderArticles(post) {
        const article = createPost(post);

        blackList.push(post.id);

        $container.append(article);
    }

    function onScrollInfinite() {
        const contentHeight = document.querySelector('.blog-articles').clientHeight,
            scrollPosition = window.pageYOffset + window.innerHeight;

        if (scrollPosition >= contentHeight) {
            let counter = 0;

            content.forEach(post => {
                if (!blackList.includes(post.id) && counter <= 10) {
                    counter++;
                    renderArticles(post);
                }
            });
        }
    }

    getResoures(`https://jsonplaceholder.typicode.com/posts`)
        .then(response => {
            response.forEach(post => {
                content.push(post);

                if (document.querySelector('.blog-articles').clientHeight <= document.documentElement.clientHeight) {
                    renderArticles(post);
                }
            });
        })
        .then(res => {
            document.addEventListener('scroll', onScrollInfinite);
        });
});