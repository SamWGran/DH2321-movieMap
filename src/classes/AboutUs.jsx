import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import '../styles/MovieMap.css'
import { height } from '@mui/system'

export default function AboutUs() {

    function responibility(person, small=false) {
        const name = person.name
        const total = person.workedOn.frontend + person.workedOn.design + person.workedOn.backend + person.workedOn.research + person.workedOn.manager
        const height = small?'0.5em':'1.5em'
        function block(text, size, color) {
            if (small)
                return <div title={text} style={{float:'left',width:(size/total*100)+'%', height:height, backgroundColor:color, textAlign:'center', overflow:'hidden'}}></div>
            else
                return <div style={{float:'left',width:(size/total*100)+'%', height:height, backgroundColor:color, textAlign:'center', overflow:'hidden'}}>{text}</div>
        }
        return (
            <>
                <div style={small?{}:{marginBottom:'2em', width:'98%'}}>
                    {small?'':name+':'}
                    <div style={small?{color:'#000', height:height}:{color:'#000', height:height, border: '3px solid #D0BDAD'}}>
                        {block('Frontend', person.workedOn.frontend, '#FF5468')}
                        {block('Design', person.workedOn.design, '#00FF65')}
                        {block('Backend', person.workedOn.backend, '#FF7742')}
                        {block('Research', person.workedOn.research, '#FFFF0F')}
                        {block('Manager', person.workedOn.manager, '#00FFF2')}
                    </div>
                </div>
            </>
        )
    }

    function aboutPerson({name, img, about, workedOn}) {
        return (
            <div style={{float:'left', width:'100%',padding:'0.25em', boxSizing:'border-box'}}>
                <div style={{
                    float:'left',
                    width:'20vh',
                    height:'20vh',
                    background:'url('+img+')',
                    backgroundSize:'cover',
                    marginRight:'1em',
                    boxSizing:'content-box',
                    border: '1px solid #D0BDAD',
                    borderRadius: '4px',
                    overflow: 'hidden'
                    }}>
                        {responibility({name, img, about, workedOn}, true)}
                    </div>
                <div class='about-person-desc'>
                    <h3 style={{marginTop:'0.5em'}}>{name}</h3>
                    <span>{about}</span>
                </div>
            </div>
        )
    }

    const aboutTheProject = <><h2>About The Project</h2><span>This app, movieMap, is an interactive tool for exploring economic data of movies, with inspiration from FinViz, 
    Board game wizard and similar projects it has been designed to focus on giving an instant overview of successes and failures 
    within the industry. Shown movies are longer than 40 minutes, with atleast 10 user ratings and were released between 
    2018-01-01 and 2022-01-01.</span></>

    const learningObjectivesReached = <><h2>Learning Objectives Reached</h2><span>- Learned D3 + React (Web Development)<br/>
    - Group dynamics<br/>
    - Iteratively improving a product<br/>
    - Recieving and implementing feedback and constructive criticism<br/>
    - Creating and presenting engaging demos</span></>

    const movieApi = <><h2>Movie API</h2><span>This product uses the TMDB API but is not endorsed or certified by TMDB.</span></>

    const sources = <><h2>Sources</h2><span>https://themoviedb.org<br/>
    https://github.com/SamWGran/DH2321-movieMap</span></>

    const button = <div className='close-button' style={{
        fontSize:'2em', 
        color:'white', 
        userSelect: 'none',
        fontWeight:'bolder', 
        backgroundColor:'#202020', 
        borderRadius:'2em',
        position:'absolute',
        top:'1rem',
        left:'1rem',
        zIndex:'30',
        width:'1em',
        height:'1em',
        textAlign:'center',
        lineHeight:'0.75em'
    }}>x</div>

    const lowe = {
        name: 'Lowe Bonnevier',
        img: 'lowe.png',
        about: (
          <>As of writing (March 2022) I am studying my fourth year at KTH. Both my bachelor's degree and master's degree are in computer science with focus on visualization. On this project I have primarily been working on integrating D3.js with React.
          <br/>
          <div style={{marginTop:'0.5em', display:'inline-block',borderTop: '2px', borderTopColor:'#D0BDAD', borderTopStyle:'solid'}}>
            <span>- You can find more information about me on my <a href="http://github.com/obewol" target="_blank">GitHub Page</a>.</span>
          </div>
          </>
        ),
        workedOn: {
            frontend: 7,
            design: 1,
            backend: 3,
            research: 4,
            manager: 1,
        }
    }

    const pontus = {
        name: 'Pontus Asp',
        img: 'pontus.png',
        about: (
            <>
                As of writing (March 2022), I am currently studying my fourth year at KTH. I have been studying information and communication technology on bachelor level and now I am studying computer science, with visualization and interactive graphics as subtrack.
                <br/><div style={{marginTop:'0.5em', display:'inline-block',borderTop: '2px', borderTopColor:'#D0BDAD', borderTopStyle:'solid'}}>
                    <span>- You can find more information on my website <a href="http://pontusasp.se" target="_blank">pontusasp.se</a>.</span>
                </div>
            </>
        ),
        workedOn: {
            frontend: 6,
            design: 4,
            backend: 0,
            research: 2,
            manager: 2,
        }
    }

    const andreas = {
        name: 'Andreas Sj??din',
        img: 'andreas.png',
        about: (
            <>
                Currently I'm studying my fourth year at KTH. I recently finished by bachelors thesis and I am now studying for the TCSCM masters track in the visualization and interactive graphics subtrack.
                <br/><div style={{marginTop:'0.5em', display:'inline-block',borderTop: '2px', borderTopColor:'#D0BDAD', borderTopStyle:'solid'}}>
                    <span>- You can find more information about me on my <a href="http://github.com/andreassjodin" target="_blank">GitHub Page</a>.</span>
                </div>
            </>
        ),
        workedOn: {
            frontend: 5,
            design: 6,
            backend: 2,
            research: 3,
            manager: 5,
        }
    }

    const simon = {
        name: 'Simon Toblad',
        img: 'simon.png',
        about: (
            <>
                I like design and visualization. Currently I'm studying my fourth year at KTH the master program in ICT Innovation Human Computer Interaction and Design. Before my masters I studied media technology and received my bachelors last year.
                <br/><div style={{marginTop:'0.5em', display:'inline-block',borderTop: '2px', borderTopColor:'#D0BDAD', borderTopStyle:'solid'}}>
                    - If you want to know more about me you can visit <a href="http://www.toblad.se/" target="_blank">toblad.se</a>
                </div>
            </>
        ),
        workedOn: {
            frontend: 1,
            design: 3,
            backend: 0,
            research: 0,
            manager: 2,
        }
    }

    const samuel = {
        name: 'Samuel Westman Granlund',
        img: 'samuel.png',
        about: (
            <>
                I???m currently on the second and final year of my masters in Interactive Media Technology with a focus of visualization. In this project I focused on project planning and structure, but also supported with development of the frontend and the dataset.
                <br/><div style={{marginTop:'0.5em', display:'inline-block',borderTop: '2px', borderTopColor:'#D0BDAD', borderTopStyle:'solid'}}>
                    - My links: <a href="https://www.linkedin.com/in/samuel-westman-granlund-405297173/" target="_blank">https://www.linkedin.com/in/samuel-westman-granlund-405297173/</a> and <a href="https://github.com/SamWGran" target="_blank">https://github.com/SamWGran</a>
                </div> 

            </>
        ),
        workedOn: {
            frontend: 2,
            design: 3,
            backend: 4,
            research: 2,
            manager: 7,
        } //front: 3, design: 3, back: 4, research: 2, manage: 6 
    }

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
                    <h1 style={{textAlign:'center'}}>Team</h1>
                    {aboutPerson(lowe)}
                    {aboutPerson(pontus)}
                    {aboutPerson(andreas)}
                    {aboutPerson(simon)}
                    {aboutPerson(samuel)}
                </div>
                <div>
                    <h2 style={{textAlign:'center'}}>Responsibility Distribution</h2>
                    {responibility(lowe)}
                    {responibility(pontus)}
                    {responibility(andreas)}
                    {responibility(simon)}
                    {responibility(samuel)}
                </div>
				<div style={{display: 'flex', justifyContent: 'center'}}>
					<div style={{background: '#b7b59b', margin: '10px', padding: '10px', borderRadius: '10px'}}>
						<iframe width="1060" height="615" src="https://www.youtube.com/embed/029lNRoR9AQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
					</div>
				</div>
            </div>
        </div>
      </div>
    );
}
