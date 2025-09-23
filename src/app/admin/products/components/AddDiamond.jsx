"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";

export default function AddDiamond(props) {
	const {
		formData,
		handleInputChange,
		shapeOptions,
		colorOptions,
		clarityOptions,
		formatPrice,
		stripPriceFormatting,
		diamondVariants,
		handleDiamondVariantChange,
		addDiamondVariant,
		removeDiamondVariant,
	} = props;

	return (
		<div className="space-y-8">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Diamond Name <span className="text-red-500">*</span>
					</label>
					<input
						type="text"
						name="name"
						value={formData.name}
						onChange={handleInputChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
						placeholder="Round Cut Diamond"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Shape <span className="text-red-500">*</span>
					</label>
					<input
						type="text"
						name="shape"
						value={formData.shape}
						onChange={handleInputChange}
						list="shapeOptions"
						className="cursor-pointer w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
						placeholder="Type or select shape"
						required
					/>
					<datalist id="shapeOptions">
						{shapeOptions.map((shape) => (
							<option key={shape} value={shape} />
						))}
					</datalist>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Certification
					</label>
					<input
						type="text"
						name="certification"
						value={formData.certification}
						onChange={handleInputChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
						placeholder="IGI"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						SKU <span className="text-red-500">*</span>
					</label>
					<input
						type="text"
						name="sku"
						value={formData.sku}
						onChange={handleInputChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
						placeholder="DIA001"
						required
					/>
				</div>
			</div>

			<div>
				<h3 className="text-lg font-medium mb-4">
					Diamond Variants <span className="text-red-500">*</span>
				</h3>
				<div className="overflow-x-auto">
					<table className="w-full border-collapse border border-gray-300">
						<thead>
							<tr className="bg-gray-50">
								<th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
									Color
								</th>
								<th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
									Clarity
								</th>
								<th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
									Carat Weight
								</th>
								<th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
									Price
								</th>
								<th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
									Action
								</th>
							</tr>
						</thead>
						<tbody>
							{diamondVariants.map((variant) => (
								<tr key={variant.id}>
									<td className="border border-gray-300 px-2 py-2">
										<input
											type="text"
											value={variant.color}
											onChange={(e) =>
												handleDiamondVariantChange(variant.id, "color", e.target.value)
											}
											list={`colorOptions-${variant.id}`}
											className="cursor-pointer w-full px-2 py-1 text-sm border-0 focus:outline-none"
											placeholder="Type or select color"
										/>
										<datalist id={`colorOptions-${variant.id}`}>
											{colorOptions.map((color) => (
												<option key={color} value={color} />
											))}
										</datalist>
									</td>
									<td className="border border-gray-300 px-2 py-2">
										<input
											type="text"
											value={variant.clarity}
											onChange={(e) =>
												handleDiamondVariantChange(variant.id, "clarity", e.target.value)
											}
											list={`clarityOptions-${variant.id}`}
											className="cursor-pointer w-full px-2 py-1 text-sm border-0 focus:outline-none"
											placeholder="Type or select clarity"
										/>
										<datalist id={`clarityOptions-${variant.id}`}>
											{clarityOptions.map((clarity) => (
												<option key={clarity} value={clarity} />
											))}
										</datalist>
									</td>
									<td className="border border-gray-300 px-2 py-2">
										<input
											type="number"
											step="0.01"
											value={variant.caratWeight}
											onChange={(e) =>
												handleDiamondVariantChange(variant.id, "caratWeight", e.target.value)
											}
											className="w-full px-2 py-1 text-sm border-0 focus:outline-none"
											placeholder="1.50"
										/>
									</td>
									<td className="border border-gray-300 px-2 py-2">
										<input
											type="text"
											value={formatPrice(variant.price)}
											onChange={(e) =>
												handleDiamondVariantChange(variant.id, "price", stripPriceFormatting(e.target.value))
											}
											className="w-full px-2 py-1 text-sm border-0 focus:outline-none"
											placeholder="1,000"
										/>
									</td>
									<td className="border border-gray-300 px-2 py-2">
										{diamondVariants.length > 1 && (
											<button
												onClick={() => removeDiamondVariant(variant.id)}
												className="cursor-pointer text-red-500 hover:text-red-700"
											>
												<Trash2 className="w-4 h-4 stroke-2" />
											</button>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<button
					onClick={addDiamondVariant}
					className="cursor-pointer mt-4 flex items-center text-primary-600 hover:text-primary-800"
				>
				<Plus className="w-4 h-4 mr-2" />
				Add
				</button>

				<div className="mt-6">
					<label className="cursor-pointer flex items-center">
						<input
							type="checkbox"
							name="availability"
							checked={formData.availability}
							onChange={handleInputChange}
							className="cursor-pointer mr-2"
						/>
						<span className="text-sm font-medium text-gray-700">Available for sale</span>
					</label>
				</div>
			</div>
		</div>
	);
}
