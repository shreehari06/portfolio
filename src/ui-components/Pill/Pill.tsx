import React from 'react'
import { Container } from './styles'
import { Typography } from '../Typography'

export interface PillProps {
    text: string
    icon?: React.ReactNode
    typographyProps: React.ComponentProps<typeof Typography>
}

const Pill = ({ text, icon, typographyProps }: PillProps) => {
    return (
        <Container>
            {icon}
            <Typography {...typographyProps}>{text}</Typography>
        </Container>
    )
}

export default Pill
