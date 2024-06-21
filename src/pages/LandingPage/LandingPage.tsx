import React from 'react'
import Section from '../../ui-components/Section/Section'
import { HeroContainer } from './styles'
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
            <Section
                title="title"
                content=""
                body="Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto ratione veritatis accusantium. Reiciendis dolor quae vitae reprehenderit, architecto odio incidunt.
"
            />
        </>
    )
}

export default LandingPage
