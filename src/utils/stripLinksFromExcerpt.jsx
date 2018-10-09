const stripLinksFromExcerpt = (excerpt) => {
    return  excerpt.replace(/(?:__|[*#])|\[(.*?)\]\(.*?\)/gm, '$1');
};

export default stripLinksFromExcerpt;
