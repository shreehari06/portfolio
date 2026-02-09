import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { NavLink } from '@/components/NavLink';
import { BrowserRouter } from 'react-router-dom';

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('NavLink Component', () => {
  it('should render with to prop and children', () => {
    const { getByRole } = renderWithRouter(<NavLink to="/test">Test Link</NavLink>);
    
    const link = getByRole('link', { name: 'Test Link' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });

  it('should apply custom className', () => {
    const { getByRole } = renderWithRouter(
      <NavLink to="/test" className="custom-class">Link</NavLink>
    );
    
    const link = getByRole('link', { name: 'Link' });
    expect(link).toHaveClass('custom-class');
  });

  it('should apply activeClassName when route is active', () => {
    const { getByRole } = renderWithRouter(
      <NavLink to="/" activeClassName="active-class">Home</NavLink>
    );
    
    const link = getByRole('link', { name: 'Home' });
    // The root route "/" should be active in our test
    expect(link).toBeInTheDocument();
  });

  it('should render children correctly', () => {
    const { getByTestId } = renderWithRouter(
      <NavLink to="/test">
        <span data-testid="child-element">Child</span>
      </NavLink>
    );
    
    expect(getByTestId('child-element')).toBeInTheDocument();
  });

  it('should forward ref correctly', () => {
    const ref = { current: null };
    renderWithRouter(
      <NavLink to="/test" ref={ref}>Link</NavLink>
    );
    
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });
});
