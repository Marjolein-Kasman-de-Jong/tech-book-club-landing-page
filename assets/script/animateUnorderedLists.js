const unorderedLists = document.querySelectorAll('.unordered-list');

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const list = entry.target;
        const listItems = list.querySelectorAll('li');

        listItems.forEach((item, index) => {
            item.style.setProperty('--i', index);
        });

        list.classList.add('is-visible');

        observer.unobserve(list);
    });
}, {
    threshold: 0.5
});

unorderedLists.forEach(list => {
    observer.observe(list);
});