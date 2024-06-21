import React from 'react'
import { Block, Container, ContentContainer, TitleContainer } from './styles'
import { Typography } from '../Typography'

export interface SectionProps {
    title: string
    content: React.ReactNode
    body?: React.ReactNode
}

const Section = ({ title, content, body }: SectionProps) => {
    return (
        <Container>
            <TitleContainer>
                <Block />
                <Typography type="body">{title}</Typography>
            </TitleContainer>
            <ContentContainer>{content}</ContentContainer>
            {body && (
                <ContentContainer>
                    <Typography type="body">{body}</Typography>
                </ContentContainer>
            )}
        </Container>
    )
}

export default Section
