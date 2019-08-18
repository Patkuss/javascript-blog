'use strict';

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
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
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
      const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
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
  let allTagsHTML = '';
  for(let tag in allTags) {
    allTagsHTML += '<li class=' + calculateTagClass(allTags[tag], tagsParams) + '><a href="#tag-' + tag + ' ">' + tag + '</a></li>';
  }
  tagList.innerHTML = allTagsHTML;
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
    const authorHTML = '<a href="#author-' + articleAuthor + '">' + articleAuthor + '</a>';
    html = html + authorHTML;
    if(!allAuthors.hasOwnProperty(articleAuthor)) {
        allAuthors[articleAuthor] = 1;
    } else {
        allAuthors[articleAuthor]++;
    }
    authorsList.innerHTML = html;
  }
  const authorList = document.querySelector(optAuthorsListSelector);
  let allAuthorsHTML = '';
  for(let author in allAuthors){
    allAuthorsHTML += '<li><a href="#author-' + author + '">' + author + ' (' + allAuthors[author] + ')</a></li>';
  }
  authorList.innerHTML = allAuthorsHTML;
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
