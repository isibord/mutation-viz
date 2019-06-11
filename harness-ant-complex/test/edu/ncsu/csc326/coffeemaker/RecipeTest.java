package edu.ncsu.csc326.coffeemaker;

import org.junit.Test;
import static org.junit.Assert.*;
import edu.ncsu.csc326.coffeemaker.Inventory;
import edu.ncsu.csc326.coffeemaker.Recipe;
import edu.ncsu.csc326.coffeemaker.CoffeeMaker;
import edu.ncsu.csc326.coffeemaker.exceptions.InventoryException;
import edu.ncsu.csc326.coffeemaker.exceptions.RecipeException;

public class RecipeTest {
	@Test
	public void testRecipeChocolate() throws RecipeException {
		Recipe recipe = new Recipe();
		recipe.setAmtChocolate("10");
		assertEquals(recipe.getAmtChocolate(), 10);
	}

	@Test(expected = RecipeException.class)
	public void testRecipeChocolate2() throws RecipeException {
		Recipe recipe = new Recipe();
		recipe.setAmtChocolate("a lot");
	}
}

