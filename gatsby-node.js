const _ = require('lodash');
const Promise = require('bluebird');
const path = require('path');
const {createFilePath} = require('gatsby-source-filesystem');
const createPaginatedPages = require('gatsby-paginate');
const userConfig = require('./config');
const deepMap = require('deep-map');

const query = ` 
          {
            allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, limit: 1000) {
              edges {
                node {
                  fields {
                    slug
                  }
                  excerpt
                  frontmatter {
                    title
                    date(formatString: "DD.MM.YYYY")
                    featuredImage {
                      childImageSharp {
                        sizes(maxWidth: 850) {
                          base64
                          aspectRatio
                          src
                          srcSet
                          sizes
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `;

exports.createPages = ({graphql, boundActionCreators}) => {
    const {createPage} = boundActionCreators;

    return new Promise((resolve, reject) => {
        const blogPost = path.resolve('./src/templates/blog-post.jsx');
        resolve(
            graphql(query).then(result => {
                if (result.errors) {
                    console.log(result.errors);
                    reject(result.errors)
                }

                // Create blog posts pages.
                const posts = result.data.allMarkdownRemark.edges;

                _.each(posts, (post, index) => {
                    const previous = index === posts.length - 1 ? null : posts[index + 1].node;
                    const next = index === 0 ? null : posts[index - 1].node;
                    console.log('path', path);

                    createPaginatedPages({
                        edges: result.data.allMarkdownRemark.edges,
                        createPage: createPage,
                        pageTemplate: "src/templates/index.jsx",
                        pageLength: userConfig.postsPerPage,
                    });

                    createPage({
                        path: post.node.fields.slug,
                        component: blogPost,
                        context: {
                            slug: post.node.fields.slug,
                            previous,
                            next,
                        },
                    })
                })
            })
        )
    })
};

const makeRelative = function makeRelative(value) {
    let newValue = value;
    if (typeof value === 'string' && path.isAbsolute(value)) {
        newValue = path.join('../../static', value);
    }

    return newValue;
};

exports.onCreateNode = ({node, boundActionCreators, getNode}) => {
    const {createNodeField} = boundActionCreators;

    if (node.internal.type === `MarkdownRemark`) {
        deepMap(node.frontmatter, makeRelative, {
            inPlace: true,
        });
        const value = createFilePath({node, getNode});
        createNodeField({
            name: `slug`,
            node,
            value,
        })
    }
};
