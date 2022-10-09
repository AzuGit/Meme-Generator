import React from "react"
import { useEffect, useState } from 'react'
import { toPng } from "html-to-image"
import download from "downloadjs"


export default function Meme() {

  const [memes, setMemes] = useState([])
  const [imageMeme, setImageMeme] = useState({
        topText: "",
        bottomText: "",
        randomImage: ""     
  })

  function handleChange(event) {
        const {name, value} = event.target
        setImageMeme(prevMeme => ({
            ...prevMeme,
            [name]: value
        }))
  }
  
  useEffect(() => {
    async function getData() {
      try {
        const response = await fetch("https://api.imgflip.com/get_memes")
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`)
        } 
        const data = await response.json()
        setMemes(data.data.memes)    
            
      } catch (error) {
        console.error(`Could not get data: ${error}`)
      }      
      }

      getData()
  }, [])
  
  function getMeme(event) {
    event.preventDefault()
    const randomNumber = Math.floor(Math.random() * memes.length)
    const url= memes[randomNumber].url
    setImageMeme(prevMeme => ({
      ...prevMeme,
         randomImage: url
    }))
  }

  const node = document.getElementById("image-to-download")

  function downloadImage() {
    toPng(node)
      .then(dataURL => 
           download(dataURL, "Custom-Image"))
      .catch(() => console.log("Error"))
  }

                                      
  
  return ( 
    <main className="container">
      <form className="form">
        <input 
          className="form--input" 
          type="text"
          placeholder="Top text"
          name="topText"
          value={imageMeme.topText}
          onChange={handleChange} />
        
        <input 
          className="form--input" 
          type="text"
          placeholder="Botton text"
          name="bottomText"
          value={imageMeme.bottomText}
          onChange={handleChange}/>
        
        <button 
          className="form--button"
          onClick={getMeme}> 
          Get your Random meme 
        </button>
        
      </form>
      <button 
        className="download--button" 
        onClick={downloadImage}>
        Download image
      </button>
      <div className="meme" id="image-to-download">
        <img 
        src={imageMeme.randomImage} 
        className="meme--image"/>
        <h2 className="meme--text top">{imageMeme.topText}</h2>
        <h2 className="meme--text bottom">{imageMeme.bottomText}</h2>
      </div>
    </main>

    
  )
}