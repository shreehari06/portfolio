import React, { useRef } from 'react'
import { Container } from './styles'

export const ANIMATION_DURATION = 200

export interface DynamicCardProps {
    cover: React.Component
    title: string
    hoverGif: React.Component
    actions: Record<string, string>
}

const DynamicCard = () => {
    const ref = useRef<HTMLDivElement>(null)

    const handleMouseEnter = () => {
        setTimeout(() => {
            ref?.current?.scrollIntoView({ behavior: 'smooth' })
        }, ANIMATION_DURATION)
    }

    return (
        <Container ref={ref} onMouseEnter={handleMouseEnter}>
            DynamicCard
        </Container>
    )
}
export default DynamicCard
