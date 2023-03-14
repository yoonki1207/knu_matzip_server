const { Matrix, inverse } = require("ml-matrix");

const ratings = [
	[5, 3, 0, 1],
	[4, 0, 0, 1],
	[1, 1, 0, 5],
	[1, 0, 0, 4],
	[0, 1, 5, 4],
];

/**
 *
 * @param {number[][]} ratings ratings user x item matrics
 * @param {number} numFactors factors number of user, item's laten factor matrics
 */
function ALS(ratings, numFactors, step = 1) {
	const numUsers = ratings.length;
	const numItems = ratings[0].length;
	let ratingsMatrix = new Matrix(ratings);

	let usersLatenMatrix = Matrix.rand(numUsers, numFactors);
	let itemsLatenMatrix = Matrix.rand(numItems, numFactors);

	let tempUserLatemMatrix = [];
	let tempItemLatemMatrix = [];
	const IdentityMatrixNumFactors = Matrix.identity(numFactors);

	// reapeat operator
	for (let i = 0; i < step; i++) {
		let s = 0;
		for (let i = 0; i < numUsers; i++) {
			s += usersLatenMatrix.getRowVector(i).pow(2).sum();
		}

		for (let i = 0; i < numItems; i++) {
			s += itemsLatenMatrix.getColumnVector(i).pow(2).sum();
		}
		console.log(s);
		// update user factors
		for (let j = 0; j < numUsers; j++) {
			// repeat u
			let ratingItemDigonalMatrix = new Matrix(numItems, numItems); // Cu(ixi)
			for (let i = 0; i < numItems; i++) {
				ratingItemDigonalMatrix.set(i, i, ratings[j][i]);
			}
			let itemsLatenMatrixTranspose = itemsLatenMatrix.transpose();
			let pu = new Matrix(numItems, 1);
			for (let l = 0; l < numItems; l++) {
				pu.set(l, 0, ratingsMatrix.getRow(j)[l] > 0 ? 1 : 0);
			}
			let updatedUserMatrix = inverse(
				itemsLatenMatrixTranspose
					.mmul(ratingItemDigonalMatrix)
					.mmul(itemsLatenMatrix)
					.add(IdentityMatrixNumFactors.mul(s))
			)
				.mmul(itemsLatenMatrixTranspose)
				.mmul(ratingItemDigonalMatrix)
				.mmul(pu); // f x 1
			tempUserLatemMatrix.push(updatedUserMatrix.to1DArray());
		}
		// update item factors
		for (let j = 0; j < numItems; j++) {
			// repeat u
			let ratingUserDigonalMatrix = new Matrix(numUsers, numUsers); // Cu(ixi)
			for (let i = 0; i < numUsers; i++) {
				ratingUserDigonalMatrix.set(i, i, ratings[i][j]);
			}
			let usersLatenMatrixTranspose = usersLatenMatrix.transpose();
			let pu = new Matrix(numUsers, 1);
			for (let l = 0; l < numUsers; l++) {
				pu.set(l, 0, ratingsMatrix.getColumn(j)[l] > 0 ? 1 : 0);
			}
			let updatedItemMatrix = inverse(
				usersLatenMatrixTranspose
					.mmul(ratingUserDigonalMatrix)
					.mmul(usersLatenMatrix)
					.add(IdentityMatrixNumFactors.mul(s))
			)
				.mmul(usersLatenMatrixTranspose)
				.mmul(ratingUserDigonalMatrix)
				.mmul(pu); // f x 1
			tempItemLatemMatrix.push(updatedItemMatrix.to1DArray());
		}

		usersLatenMatrix = new Matrix(tempUserLatemMatrix).transpose();
		itemsLatenMatrix = new Matrix(tempItemLatemMatrix).transpose();
		ratingsMatrix = usersLatenMatrix.transpose().mmul(itemsLatenMatrix);
	}
	// return [usersLatenMatrix, itemsLatenMatrix];
	return usersLatenMatrix.transpose().mmul(itemsLatenMatrix);
}
/** @var {Matrix} */
let result = ALS(ratings, 20);
let ret = [];
for (let i = 0; i < result.rows; i++) {
	let sum = result.getRowVector(i).sum();
	ret.push(result.getRowVector(i).div(sum));
}
console.log(ret);

module.exports = ALS;
