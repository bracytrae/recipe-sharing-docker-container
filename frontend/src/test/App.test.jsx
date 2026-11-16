
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import App from '../App';

const sampleRecipe = {
  id: 1,
  name: 'Chocolate Chip Cookies',
  ingredients: 'Flour\nSugar',
  instructions: 'Mix and bake',
  cookTime: '25 minutes'
};

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => [sampleRecipe]
  }));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Recipe Sharing App Tests', () => {

  test('should display the application title', () => {
    render(<App />);

    expect(
      screen.getByText('🍳 Recipe Sharing App')
    ).toBeInTheDocument();
  });

  test('should display recipes from the API', async () => {
    render(<App />);

    expect(
      await screen.findByText('Chocolate Chip Cookies')
    ).toBeInTheDocument();

    expect(
    screen.getByText(/25 minutes/)
    ).toBeInTheDocument();
  });

  test('should display the recipe form', () => {
    render(<App />);

    expect(
      screen.getByPlaceholderText('Recipe Name')
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText('Ingredients (one per line)')
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Add Recipe' })
    ).toBeInTheDocument();
  });

  test('should submit a new recipe', async () => {
    const newRecipe = {
      name: 'Pasta',
      ingredients: 'Noodles',
      instructions: 'Boil noodles',
      cookTime: '15 minutes'
    };

    render(<App />);

    await screen.findByText('Chocolate Chip Cookies');

    fireEvent.change(
      screen.getByPlaceholderText('Recipe Name'),
      { target: { value: newRecipe.name } }
    );

    fireEvent.change(
      screen.getByPlaceholderText('Cook Time (e.g., 30 minutes)'),
      { target: { value: newRecipe.cookTime } }
    );

    fireEvent.change(
      screen.getByPlaceholderText('Ingredients (one per line)'),
      { target: { value: newRecipe.ingredients } }
    );

    fireEvent.change(
      screen.getByPlaceholderText('Cooking Instructions'),
      { target: { value: newRecipe.instructions } }
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Add Recipe' })
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/recipes'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(newRecipe)
        })
      );
    });
  });

});
