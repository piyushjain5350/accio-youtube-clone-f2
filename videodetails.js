const videoCardContainer = document.querySelector('.container');
const ytVideo =  document.querySelector('.yt_video');
const videoId = localStorage.getItem("videoId")
const vtitle =   document.querySelector('.vtitle');
const comments =  document.querySelector('.comments');
const comment =  document.querySelector('.co');

let api_key = "AIzaSyDXgk-dd7hc9Fc7GbDhFJc_paW0Y_JAof0";
let video_http = "https://www.googleapis.com/youtube/v3/videos";
let channel_http = "https://www.googleapis.com/youtube/v3/channels?";
let comment_http = "https://www.googleapis.com/youtube/v3"

ytVideo.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`
console.log(videoId)

let curl = `${comment_http}/commentThreads?part=snippet&videoId=${videoId}&maxResults=50&key=${api_key}`
let url = `${video_http}?part=snippet&id=${videoId}&key=${api_key}`
let surl = `${video_http}?part=statistics&id=${videoId}&key=${api_key}`


console.log(surl);
const response =  fetch (url,{
    method:"get"
})
.then(res => res.json())
.then(data => {
   
    getChannelIcon(data)
 fetchVideoStats(data)  

})

const fetchComments = async (stats)=> {
const res = await fetch(curl,{method:"get"})
const data = await res.json()
renderCommentcount({stats,data})
}

const fetchVideoStats = async (data)=> {
    const res = await fetch(surl,{method:"get"})
    const stats = await res.json()
    makeVideoTitle({data,stats})
    fetchComments(stats)
}

const getChannelIcon = (data) => {
    fetch(channel_http + new URLSearchParams({
        key: api_key,
        part: 'snippet',
        id: data.items[0].snippet.channelId
    }))
    .then(res => res.json())
    .then(data => {
       // video_data.channelThu 
       
        // makeChannelDescription(data)
        let id  = data.items[0].id
        getChannelStats({id,data})
    })
}


const getChannelStats = async({id,data})=> {
    let url = `${channel_http}part=statistics&id=${id}&key=${api_key}`
    const res = await fetch(url,{method:"get"})
    const stats = await res.json()
    makeChannelDescription({data,stats})
}

const  makeChannelDescription = ({data,stats})=>{
    console.log(stats)
    vtitle.innerHTML += `
    <div class = "channelinfo">
        <img class="channel-icon" src = "${data.items[0].snippet.thumbnails.default.url}">
        <div >
        <p>${data.items[0].snippet.localized.title}</p>
        <p class="channelinfop">${stats.items[0].statistics.subscriberCount} Subscribers</p>
        </div>
      
      </div> 
    `
}

const makeVideoTitle = ({data,stats}) =>{
   
    vtitle.innerHTML += `
    <h3>${data.items[0].snippet.title}</h3>
    <div class = "stats">
     <p>${stats.items[0].statistics.viewCount} Views</p>
     <div class="likestats">
     <img src="images/Button-Btn.png">
     <p>${stats.items[0].statistics.likeCount}</p>
     </div>
     
    </div>
    `
}

const renderCommentcount = ({stats,data})=> {
    console.log(stats);
    comments.innerHTML += `
    <h4>${stats.items[0].statistics.commentCount} Comments</h4>
    <div class="comment">
   </div>
    `
    data.items.map((item)=>{
        renderComments(item.snippet.topLevelComment.snippet)
    })
}

const renderComments = (item)=> {
  
comment.innerHTML += `
<div class = "commentCont">
<img class="channel-icon" src="${item.authorProfileImageUrl}">
<div class = "commentinfo">
<p class="authorname">${item.authorDisplayName}</p>
<p>${item.textDisplay}</p>
</div>

</div>

`
}
