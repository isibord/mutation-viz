package com.triangle;

import org.junit.Test;
import static org.junit.Assert.*;
import static com.triangle.Triangle.Type;
import static com.triangle.Triangle.Type.*;

/**
 * Test class for the Triangle implementation.
 */
public class TriangleTest {

    // Full Coverage Tests

    @Test
    public void InstantiationTest() {
        Triangle t = new Triangle();
    }

    @Test
    public void InvalidATest() {
        Type actual = Triangle.classify(-1, 2, 3);
        Type expected = INVALID;
        assertEquals(expected, actual);
    }

    @Test
    public void InvalidADuplicateTest() {
        Type actual = Triangle.classify(-2, 2, 3);
        Type expected = INVALID;
        assertEquals(expected, actual);
    }

    @Test
    public void InvalidBTest() {
        Type actual = Triangle.classify(2, -1, 3);
        Type expected = INVALID;
        assertEquals(expected, actual);
    }

    @Test
    public void InvalidCTest() {
        Type actual = Triangle.classify(1, 2, -3);
        Type expected = INVALID;
        assertEquals(expected, actual);
    }

    @Test
    public void IsoscelesABTest() {
        Type actual = Triangle.classify(2, 2, 1);
        Type expected = ISOSCELES;
        assertEquals(expected, actual);
    }

    @Test
    public void IsoscelesACTest() {
        Type actual = Triangle.classify(2, 1, 2);
        Type expected = ISOSCELES;
        assertEquals(expected, actual);
    }

    @Test
    public void IsoscelesBCTest() {
        Type actual = Triangle.classify(1, 2, 2);
        Type expected = ISOSCELES;
        assertEquals(expected, actual);
    }

    @Test
    public void InvalidLongATest() {
        Type actual = Triangle.classify(4, 1, 2);
        Type expected = INVALID;
        assertEquals(expected, actual);
    }

    @Test
    public void InvalidLongBTest() {
        Type actual = Triangle.classify(1, 4, 2);
        Type expected = INVALID;
        assertEquals(expected, actual);
    }

    @Test
    public void InvalidLongCTest() {
        Type actual = Triangle.classify(1, 2, 4);
        Type expected = INVALID;
        assertEquals(expected, actual);
    }

    @Test
    public void ScaleneTest() {
        Type actual = Triangle.classify(2, 3, 4);
        Type expected = SCALENE;
        assertEquals(expected, actual);
    }

    @Test
    public void EquilateralTest() {
        Type actual = Triangle.classify(3, 3, 3);
        Type expected = EQUILATERAL;
        assertEquals(expected, actual);
    }

    @Test
    public void InvalidIsoscelesLongATest() {
        Type actual = Triangle.classify(3, 1, 1);
        Type expected = INVALID;
        assertEquals(expected, actual);
    }

    @Test
    public void InvalidIsoscelesLongBTest() {
        Type actual = Triangle.classify(1, 3, 1);
        Type expected = INVALID;
        assertEquals(expected, actual);
    }

    @Test
    public void InvalidIsoscelesLongCTest() {
        Type actual = Triangle.classify(1, 1, 3);
        Type expected = INVALID;
        assertEquals(expected, actual);
    }
}