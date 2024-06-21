import styled from 'styled-components'

export const Container = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: ${14 / 16}rem ${12 / 16}rem; // 0.875rem 0.75rem
    margin: 0 auto;
    gap: ${8 / 16}rem; // 0.5rem
    box-sizing: border-box;
    background: #ffffff;
    border: ${1 / 16}rem solid #e6e6e6; // 0.0625rem
    border-radius: ${20 / 16}rem; // 1.25rem
`
