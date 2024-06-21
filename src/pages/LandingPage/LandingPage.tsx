import React from 'react'
import Section from '../../ui-components/Section/Section'
import { HeroContainer, ProjectsContainer } from './styles'
import { BoldText, Typography } from '../../ui-components'

const LandingPage = () => {
    return (
        <>
            <HeroContainer>
                <Typography type="subheading">
                    Hey, I’m Shreehari Thakral 👋
                </Typography>
                <Typography type="heading">
                    I transform ideas to end-to-end products.
                </Typography>
                <Typography type="body">
                    <BoldText>Full-stack engineer</BoldText>, currently building
                    high-scale B2C pricing solutions at Periscope by
                    <BoldText> McKinsey&Company.</BoldText>
                </Typography>
            </HeroContainer>

            <ProjectsContainer>
                <Typography type="heading" id="projects-heading">
                    projects
                </Typography>
                <Section
                    title="CSS Showcase"
                    content=""
                    body="Collection of three landing pages implemented without any javascript, showcasing my CSS prowess."
                />
            </ProjectsContainer>
        </>
    )
}

export default LandingPage
