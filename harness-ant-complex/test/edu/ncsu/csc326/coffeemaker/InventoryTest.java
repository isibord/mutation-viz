package edu.ncsu.csc326.coffeemaker;

import org.junit.Test;
import static org.junit.Assert.*;
import edu.ncsu.csc326.coffeemaker.Inventory;
import edu.ncsu.csc326.coffeemaker.exceptions.InventoryException;
import edu.ncsu.csc326.coffeemaker.exceptions.RecipeException;

public class InventoryTest {
	
	@Test
	public void testDefaults() {
		Inventory inventory = new Inventory();
		int chocUnits = inventory.getChocolate();
		assertEquals(15, chocUnits);

		int coffee = inventory.getCoffee();
		assertEquals(15, coffee);
	}

	@Test
	public void testSetChocolate() {
		Inventory inventory = new Inventory();
		inventory.setChocolate(100);
		int chocUnits = inventory.getChocolate();
		assertEquals(100, chocUnits);
	}

	
	@Test
	public void testSetChocolate2(){
		Inventory inventory = new Inventory();
		inventory.setChocolate(-5);
		int chocUnits = inventory.getChocolate();
		assertEquals(15, chocUnits);
	}

	@Test
	public void testAddChocolate() throws InventoryException {
		Inventory inventory = new Inventory();
		inventory.addChocolate("5");
		int chocUnits = inventory.getChocolate();
		assertEquals(20, chocUnits);
	}

	@Test(expected = InventoryException.class)
	public void testAddChocolate2()  throws InventoryException{
		Inventory inventory = new Inventory();
		inventory.addChocolate("a");
	}

	@Test(expected = InventoryException.class)
	public void testAddChocolate3()  throws InventoryException {
		Inventory inventory = new Inventory();
		inventory.addChocolate("-5");
	}

	@Test
	public void testSetCoffee(){
		Inventory inventory = new Inventory();
		inventory.setCoffee(1);
		assertEquals(inventory.getCoffee(), 1);
	}

	@Test
	public void testSetCoffee2(){
		Inventory inventory = new Inventory();
		inventory.setCoffee(-1);
		assertEquals(inventory.getCoffee(), 15);
	}

	@Test
	public void testAddCoffee1()   throws InventoryException{
		Inventory inventory = new Inventory();
		inventory.addCoffee("5");
	}

	@Test(expected = InventoryException.class)
	public void testAddCoffee2()  throws InventoryException{
		Inventory inventory = new Inventory();
		inventory.addCoffee("a");
	}

	@Test(expected = InventoryException.class)
	public void testAddCoffee3()  throws InventoryException {
		Inventory inventory = new Inventory();
		inventory.addCoffee("-5");
	}

	@Test
	public void testUseIngredientsFail() throws RecipeException {
		Inventory inventory = new Inventory();
		Recipe recipe = new Recipe();
		recipe.setAmtChocolate("20");
		recipe.setAmtCoffee("20");
		recipe.setAmtMilk("20");
		recipe.setAmtSugar("20");
		assertEquals(false, inventory.enoughIngredients(recipe));
	}

	@Test
	public void testUseIngredientsSuccess() {
		Inventory inventory = new Inventory();
		Recipe recipe = new Recipe();
		assertEquals(true, inventory.enoughIngredients(recipe));
	}

	@Test
	public void testToString() {
		Inventory inventory = new Inventory();
		assertEquals("Coffee: 15\nMilk: 15\nSugar: 15\nChocolate: 15\n", inventory.toString());
	}

	@Test
	public void testAddSugar() throws InventoryException {
		Inventory inventory = new Inventory();
		inventory.addSugar("10");
		assertEquals(inventory.getSugar(), 25);
	}
}

