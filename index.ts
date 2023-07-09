// Problem => https://github.com/playmast3r/backend-ts-assignment#readme

/* 
    Steps for solutions :-
        1: Create static price rules
        2: declare variables and functions in classes
        3: fn() => scan() & total()
            a:scan()=> scans an item pushes to cart
            b:total()=> loops through cart and check for any offer that needs to be applied and calculates the price accordingly
        4: total funcitons return total price
*/

//Step 1
// price rules can be modified here, pls maintain the format
var pricingRules1 = {
    bulk: { op11: { minQty: 4, price: 899.99 }, wtch: { minQty: 4, price: 199.99 } },
    xForY: { buds: { x: 3, y: 2 } },
};

interface Cart {
    [key: string]: number;
}
interface PricingRules {
    [key: string]: { [key: string]: { [key: string]: number } };
}
interface PricingList {
    [key: string]: { name: string; price: number };
}
class Checkout {
    //step 2
    pricingList: PricingList = {
        op10: { name: "Oneplus 10", price: 849.99 },
        op11: { name: "Oneplus 11", price: 949.99 },
        buds: { name: "Earbuds", price: 129.99 },
        wtch: { name: "Smart Watch", price: 229.99 },
    };

    pricingRules: PricingRules = {};
    cart: Cart = {};

    constructor(pricingRules: object) {
        this.pricingRules = { ...pricingRules };
    }

    //step 3:a
    scan(itemName: string): void {
        // if item exists in cart then it will inc it else it will add to cart and assign 1
        if (this.cart?.[itemName]) {
            this.cart[itemName]++;
        } else {
            this.cart = { ...this.cart, [itemName]: 1 };
        }
    }

    //step 3:b
    total(): number {
        var totalAmount = 0;

        // Loop through cart
        Object.keys(this.cart).forEach((key) => {
            let nItems = this.cart[key];
            let price = this.pricingList[key].price;
            // Check for bulk offer
            if (this.pricingRules.bulk[key]) {
                if (nItems >= this.pricingRules.bulk[key].minQty) {
                    totalAmount = totalAmount + nItems * this.pricingRules.bulk[key].price;
                } else {
                    totalAmount += nItems * price;
                }
                // Check for xForY price offer
            } else if (this.pricingRules.xForY[key]) {
                if (nItems >= this.pricingRules.xForY[key].x) {
                    // Getting difference in items on which no offer can be applied
                    let diff = nItems % this.pricingRules.xForY[key].x;
                    // Getting nTimes the offer can be applies Ex: If offer is 3 for 2, and nItems is 6, times will be 2, if nItems is 5, times will be 1
                    let times = Math.floor(nItems / this.pricingRules.xForY[key].x);

                    totalAmount += this.pricingRules.xForY[key].y * price * times;
                    totalAmount += diff * price;
                } else {
                    totalAmount += nItems * price;
                }
                // If no offer available for the item, it calculates price by nItems * price
            } else {
                totalAmount += nItems * price;
            }
        });

        //Step 4
        return parseFloat(totalAmount.toFixed(2));
    }
}

// ===== Test Cases =====
function testCase1() {
    //SKUs Scanned: buds, op10, buds, buds Total expected: $1109.97

    var checkout = new Checkout(pricingRules1);
    checkout.scan("buds");
    checkout.scan("op10");
    checkout.scan("buds");
    checkout.scan("buds");
    console.log(`Scanned: buds, op10, buds, buds = $${checkout.total()}`);
}
function testCase2() {
    //SKUs Scanned: wtch, op11, op11, op11, buds, buds, op11, op11 Total expected: $4989.92

    var checkout = new Checkout(pricingRules1);
    checkout.scan("wtch");
    checkout.scan("op11");
    checkout.scan("op11");
    checkout.scan("op11");
    checkout.scan("buds");
    checkout.scan("buds");
    checkout.scan("op11");
    checkout.scan("op11");
    console.log(`Scanned: wtch, op11, op11, op11, buds, buds, op11, op11 = $${checkout.total()}`);
}

testCase1();
testCase2();