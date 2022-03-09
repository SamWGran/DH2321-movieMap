import {useState, useEffect} from 'react'

export default function useMousePosition() {
    const [mousePosition, setMousePosition] = useState([0, 0])
    
    const update = (e) => setMousePosition([e.clientX, e.clientY])

    useEffect(() => {
        window.addEventListener('mousemove', update)
        return () => window.removeEventListener('mousemove', update)
    }, [])
    
    return mousePosition
}