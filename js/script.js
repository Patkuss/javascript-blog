'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  articleTagLink: Handlebars.compile(document.querySelector('#template-article-tag-link').innerHTML),
  articleAuthorLink: Handlebars.compile(document.querySelector('#template-article-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML)
}

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optTagsListSelector = '.tags.list',
  optCloudClassCount = '5',
  optCloudClassPrefix = 'tag-size-',
  optAuthorsListSelector = '.authors.list';


const titleClickHandler = function(event){
  event.preventDefault();
  const clickedElement = this;
  const activeLinks = document.querySelectorAll('.titles a.active');
  for(let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }
  clickedElement.classList.add('active');
  const activeArticles = document.querySelectorAll('.posts article.post');
  for(let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }
  const articleSelector = clickedElement.getAttribute('href');
  const targetArticle = document.querySelector(articleSelector);
  targetArticle.classList.add('active');
}


function generateTitleLinks(customSelector = '') {
  const titleList = document.querySelector(optTitleListSelector);
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  let html = '';
  for(let article of articles) {
    const articleId = article.getAttribute('id');
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    html = html + linkHTML;
  }
  titleList.innerHTML = html;
  const links = document.querySelectorAll('.titles a');
  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function calculateTagsParams(tags){
    const params = {
      max: 0,
      min: 999999,
    };
    for(let tag in tags){
    params.max = Math.max(tags[tag], params.max);
    params.min = Math.min(tags[tag], params.min);
  }
  return params;
}

function calculateTagClass(count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );
  return(optCloudClassPrefix + classNumber);
}

function generateTags(){
  let allTags = {};
  const articles = document.querySelectorAll(optArticleSelector);
  for(let article of articles) {
    const tagsList = article.querySelector(optArticleTagsSelector);
    let html = '';
    const articleTags = article.getAttribute('data-tags');
    const articleTagsArray = articleTags.split(' ');
    for(let tag of articleTagsArray) {
      const linkHTMLData = {tag: tag};
      const linkHTML = templates.articleTagLink(linkHTMLData);
      html = html + linkHTML + ' ';
      if(!allTags.hasOwnProperty(tag)) {
          allTags[tag] = 1;
      } else {
          allTags[tag]++;
      }
    }
    tagsList.innerHTML = html;
  }
  const tagList = document.querySelector(optTagsListSelector);
  const tagsParams = calculateTagsParams(allTags);
  const allTagsData = {tags: []};
  for(let tag in allTags) {
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
  }
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
}

generateTags();


function tagClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const tag = href.replace('#tag-', '');
  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  for(let activeTagLink of activeTagLinks) {
    activeTagLink.classList.remove('active');
  }
  const sameActiveTagLinks = document.querySelectorAll('a[href="' + href + '"]');
  for(let sameActiveTagLink of sameActiveTagLinks) {
    sameActiveTagLink.classList.add('active');
  }
  generateTitleLinks('[data-tags~="' + tag + '"]');
}


function addClickListenersToTags(){
  const links = document.querySelectorAll('.post-tags a');
  for(let link of links) {
    link.addEventListener('click', tagClickHandler);
  }
}

addClickListenersToTags();


function generateAuthors(){
  let allAuthors = {};
  const articles = document.querySelectorAll(optArticleSelector);
  for(let article of articles) {
    const authorsList = article.querySelector(optArticleAuthorSelector);
    let html = '';
    const articleAuthor = article.getAttribute('data-author');
    const linkHTMLData = {author: articleAuthor};
    const linkHTML = templates.articleAuthorLink(linkHTMLData);
    html = html + linkHTML;
    if(!allAuthors.hasOwnProperty(articleAuthor)) {
        allAuthors[articleAuthor] = 1;
    } else {
        allAuthors[articleAuthor]++;
    }
    authorsList.innerHTML = html;
  }
  const authorList = document.querySelector(optAuthorsListSelector);
  const allAuthorsData = {author: []};
  for(let author in allAuthors){
    allAuthorsData.author.push({
      author: author,
      count: allAuthors[author]
    });
  }
  authorList.innerHTML = templates.authorCloudLink(allAuthorsData);
}

generateAuthors();


function authorClickHandler(event){
    event.preventDefault();
    const clickedElement = this;
    const href = clickedElement.getAttribute('href');
    const author = href.replace('#author-', '');
    const activeAuthorLinks = document.querySelectorAll('a[href="' + href + '"]');
    for(let activeAuthorLink of activeAuthorLinks){
      activeAuthorLink.classList.add('active');
    }
  generateTitleLinks('[data-author="' + author + '"]');
}


function addClickListenersToAuthors(){
  const authorLinks = document.querySelectorAll('.post-author a');
  for (let authorLink of authorLinks) {
    authorLink.addEventListener('click', authorClickHandler);
  }
}

addClickListenersToAuthors();
