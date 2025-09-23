"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";

export default function AddColorStone(props) {
	const {
		formData,
		handleInputChange,
		shapeOptions,
		formatPrice,
		stripPriceFormatting,
		colorStoneVariants,
		handleColorStoneVariantChange,
		addColorStoneVariant,
		removeColorStoneVariant,
	} = props;

	return (
		<div className="space-y-8">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Color Stone Name <span className="text-red-500">*</span>
					</label>
					<input
						type="text"
						name="name"
						value={formData.name}
						onChange={handleInputChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
						placeholder="Ruby Round Cut"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Color <span className="text-red-500">*</span>
					</label>
					<input
						type="text"
						name="color"
						value={formData.color}
						onChange={handleInputChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
						placeholder="Ruby, Sapphire, Emerald, etc."
						required
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
						placeholder="CS001"
						required
					/>
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
			</div>

			<div>
				<h3 className="text-lg font-medium mb-4">
					Color Stone Variants <span className="text-red-500">*</span>
				</h3>
				<div className="overflow-x-auto">
					<table className="w-full border-collapse border border-gray-300">
						<thead>
							<tr className="bg-gray-50">
								<th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">Shape</th>
								<th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">Dimension</th>
								<th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">Carat Weight</th>
								<th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">Price</th>
								<th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">Action</th>
							</tr>
						</thead>
						<tbody>
							{colorStoneVariants.map((variant) => (
								<tr key={variant.id}>
									<td className="border border-gray-300 px-2 py-2">
										<input
											type="text"
											value={variant.shape}
											onChange={(e) => handleColorStoneVariantChange(variant.id, "shape", e.target.value)}
											list={`shapeOptions-colorstone-${variant.id}`}
											className="cursor-pointer w-full px-2 py-1 text-sm border-0 focus:outline-none"
											placeholder="Type or select shape"
										/>
										<datalist id={`shapeOptions-colorstone-${variant.id}`}>
											{shapeOptions.map((shape) => (
												<option key={shape} value={shape} />
											))}
										</datalist>
									</td>
									<td className="border border-gray-300 px-2 py-2">
										<input
											type="text"
											value={variant.dimension}
											onChange={(e) => handleColorStoneVariantChange(variant.id, "dimension", e.target.value)}
											className="w-full px-2 py-1 text-sm border-0 focus:outline-none"
											placeholder="4x6"
										/>
									</td>
									<td className="border border-gray-300 px-2 py-2">
										<input
											type="number"
											step="0.01"
											value={variant.caratWeight}
											onChange={(e) => handleColorStoneVariantChange(variant.id, "caratWeight", e.target.value)}
											className="w-full px-2 py-1 text-sm border-0 focus:outline-none"
											placeholder="1.50"
										/>
									</td>
									<td className="border border-gray-300 px-2 py-2">
										<input
											type="text"
											value={formatPrice(variant.price)}
											onChange={(e) => handleColorStoneVariantChange(variant.id, "price", stripPriceFormatting(e.target.value))}
											className="w-full px-2 py-1 text-sm border-0 focus:outline-none"
											placeholder="1,000"
										/>
									</td>
									<td className="border border-gray-300 px-2 py-2">
										{colorStoneVariants.length > 1 && (
											<button onClick={() => removeColorStoneVariant(variant.id)} className="cursor-pointer text-red-500 hover:text-red-700">
												<Trash2 className="w-4 h-4 stroke-2" />
											</button>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<button onClick={addColorStoneVariant} className="cursor-pointer mt-4 flex items-center text-primary-600 hover:text-primary-800">
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
