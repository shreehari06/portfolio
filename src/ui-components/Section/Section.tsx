import React from 'react'
import { Block, Container, ContentContainer, TitleContainer } from './styles'
import { Typography } from '../Typography'

export interface SectionProps {
    title: string
    children?: React.ReactNode
    bodyText?: React.ReactNode
}

const Section = ({ title, children, bodyText }: SectionProps) => {
    return (
        <Container>
            <TitleContainer>
                <Block />
                <Typography type="body">{title}</Typography>
            </TitleContainer>
            {children && <ContentContainer>{children}</ContentContainer>}
            {bodyText && (
                <ContentContainer>
                    <Typography type="body">{bodyText}</Typography>
                </ContentContainer>
            )}
        </Container>
    )
}

export default Section
