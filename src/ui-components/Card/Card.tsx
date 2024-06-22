import React from 'react'
import { Container } from './styles'

export interface CardProps {
    children?: React.ReactNode
}
const Card = ({ children }: CardProps) => {
    return <Container>{children}</Container>
}

export default Card
