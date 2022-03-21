import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import '../styles/MovieMap.css'

export default function AboutUs() {

    function aboutPerson(img, name, description) {
        return (
            <div style={{float:'left', width:'100%'}}>
                <div style={{float:'left'}}><img src={img}/></div>
                <div class='about-person-desc'>
                    <h2>{name}</h2>
                    <span>{description}</span>
                </div>
            </div>
        )
    }

    const aboutTheProject = <><h2>About The Project</h2><span>It is an interactive tool for exploring economic data of movies, with inspiration from FinViz, 
    Board game wizard and similar projects it has been designed to focus on giving an instant overview of successes and failures 
    within the industry. Shown movies are longer than 40 minutes, with atleast 10 user ratings and were released between 
    2018-01-01 and 2022-01-01</span></>

    const learningObjectivesReached = <><h2>Learning Objectives Reached</h2><span>Learned D3 + React (Web Development)<br/>
    Group dynamics<br/>
    Iteratively improving a product<br/>
    Recieving and implementing feedback and constructive criticism<br/>
    Creating and presenting engaging demos</span></>

    const movieApi = <><h2>Movie API</h2><span>This product uses the TMDB API but is not endorsed or certified by TMDB.</span></>

    const sources = <><h2>Sources</h2><span>https://themoviedb.org<br/>
    https://github.com/SamWGran/DH2321-movieMap</span></>

    const button = <div style={{fontSize:'2em', color:'red', fontWeight:'bolder',backgroundColor:'white',borderRadius:'2em',position:'absolute',top:'1rem',left:'1rem',zIndex:'30',width:'1em',height:'1em',textAlign:'center',lineHeight:'0.75em'}}>x</div>

    const pontus = aboutPerson('logo512.png', 'Pontus Asp', <>Hejhejhejhejehhejhee<b>HEJ</b>hej</>)
    const pontus1 = aboutPerson('logo512.png', 'Pontus Asp 1', 'hejhejehejhejhejehjhejhejh')
    const pontus2 = aboutPerson('logo512.png', 'Pontus Asp 2', 'hejhejehejhejhejehjhejhejh')

    return (
      <div id='AboutUs' className='hidden'>
        <div onClick={() => {
            document.getElementById('AboutUs').classList.add('hidden')
            document.getElementsByClassName('App')[0].classList.remove('blurred')
            }}>{button}</div>
        <div className='AboutUs-container'>
            <div style={{float:'left', width:'25vw', padding: '2em', boxSizing:'border-box'}}>
                {aboutTheProject}
                {learningObjectivesReached}
                {movieApi}
                {sources}
                <br/><img style={{paddingTop:'1em'}} src='moviedb.svg'/>
            </div>
            <div style={{float:'left', width: '75vw', height: '100vh', overflowY: 'auto', boxSizing:'border-box'}}>
                {pontus}
                {pontus1}
                {pontus2}
            </div>
        </div>
      </div>
    );
}
