import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import '../styles/MovieMap.css'

export default function AboutUs() {

    function aboutPerson(img, name, description) {
        return (
            <div style={{float:'left', width:'100%',padding:'0.25em', boxSizing:'border-box'}}>
                <div style={{
                    float:'left',
                    width:'20vh',
                    height:'20vh',
                    background:'url('+img+')',
                    backgroundSize:'cover',
                    marginRight:'1em',
                    boxSizing:'content-box'
                    }}></div>
                <div class='about-person-desc'>
                    <h3 style={{marginTop:'0.5em'}}>{name}</h3>
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

    const lowe = aboutPerson('lowe.png', 'Lowe', <>Hejhejhejhejehhejhee<b>HEJ</b>hej</>)
    const pontus = aboutPerson('pontus.png', 'Pontus Asp', (
        <>
            As of writing (March 2022), I am currently studying my fourth year at KTH. I have been studying information and communication technology on bachelor level and now I am studying computer science, with visualization and interactive graphics as subtrack.
            <br/><div style={{marginTop:'0.5em', display:'inline-block',borderTop: '2px', borderTopColor:'#D0BDAD', borderTopStyle:'solid'}}>
                <span>- You can find more information on my website <a href="http://pontusasp.se" target="_blank">pontusasp.se</a>.</span>
            </div>
        </>
    ))
    const andreas = aboutPerson('andreas.png', 'Andreas SJödin', 'hejhejehejhejhejehjhejhejh')
    const simon = aboutPerson('simon.png', 'Simon', 'hejhejehejhejhejehjhejhejh')
    const samuel = aboutPerson('samuel.png', 'Samuel', 'hejhejehejhejhejehjhejhejh')

    return (
      <div id='AboutUs' className='hidden'>
        <div onClick={() => {
            document.getElementById('AboutUs').classList.add('hidden')
            document.getElementsByClassName('App')[0].classList.remove('blurred')
            }}>{button}</div>
        <div className='AboutUs-container'>
            <div style={{float:'left', width:'25vw', padding: '2em', boxSizing:'border-box', height:'100vh', overflowY:'auto'}}>
                {aboutTheProject}
                {learningObjectivesReached}
                {movieApi}
                {sources}
                <br/><img style={{paddingTop:'1em'}} src='moviedb.svg'/>
            </div>
            <div style={{float:'right', width: '74.5vw', height: '100vh', overflowY: 'auto', boxSizing:'border-box'}}>
                <div>
                    <h2>Team</h2>
                    {lowe}
                    {pontus}
                    {andreas}
                    {simon}
                    {samuel}
                </div>
            </div>
        </div>
      </div>
    );
}
