const userConfig = require('./config');

module.exports = {
    pathPrefix: '/',
    siteMetadata: {
        title: userConfig.title,
        author: userConfig.author,
    },
    plugins: [
        `gatsby-plugin-react-helmet`,
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/src/pages`,
                name: "pages",
            },
        },
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                path: `${__dirname}/static/images`,
                name: 'images',
            },
        },
        {
            resolve: `gatsby-transformer-remark`,
            options: {
                excerpt_separator: `<!-- end -->`,
                plugins: [
                    //`gatsby-remark-relative-images-v2`,
                    {
                        resolve: `gatsby-remark-images`,
                        options: {
                            maxWidth: 700,
                            linkImagesToOriginal: false,
                            wrapperStyle: 'margin: 15px -30px !important'
                        },
                    },
                    {
                        resolve: `gatsby-remark-responsive-iframe`,
                        options: {
                            wrapperStyle: `margin-bottom: 1.0725rem`,
                        },
                    },
                    `gatsby-remark-prismjs`,
                    `gatsby-remark-copy-linked-files`,
                    `gatsby-remark-smartypants`,
                ],
            },
        },
        {
            resolve: `gatsby-plugin-google-analytics`,
            options: {
                trackingId: 'UA-111925650-2',
            },
        },
        `gatsby-plugin-offline`,
        `gatsby-plugin-netlify-cms`,
        `gatsby-transformer-sharp`,
        `gatsby-plugin-sharp`,
        `gatsby-plugin-remove-trailing-slashes`,
    ],
};
