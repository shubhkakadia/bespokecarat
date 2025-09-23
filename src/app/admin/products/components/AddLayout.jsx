"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";

export default function AddLayout(props) {
	const {
		formData,
		handleInputChange,
		shapeOptions,
		layoutType,
		setLayoutType,
		layoutPrice,
		setLayoutPrice,
		layoutTypeOptions,
		formatPrice,
		stripPriceFormatting,
		layoutVariants,
		handleLayoutVariantChange,
		addLayoutVariant,
		removeLayoutVariant,
		colorRanges,
		clarityRanges,
	} = props;

	const totalPcs = Array.isArray(layoutVariants)
		? layoutVariants.reduce((sum, variant) => sum + (parseInt(variant.totalPcs) || 0), 0)
		: 0;
	const totalCaratWeight = Array.isArray(layoutVariants)
		? layoutVariants.reduce((sum, variant) => sum + (parseFloat(variant.totalCaratWeight) || 0), 0)
		: 0;

	return (
		<div className="space-y-8">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Layout Name <span className="text-red-500">*</span></label>
					<input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Tennis Bracelet Layout" required />
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">SKU <span className="text-red-500">*</span></label>
					<input type="text" name="sku" value={formData.sku} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="LAY001" required />
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Layout Type <span className="text-red-500">*</span></label>
					<input type="text" value={layoutType} onChange={(e) => setLayoutType(e.target.value)} list="layoutTypeOptions" className="cursor-pointer w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Type or select layout type" required />
					<datalist id="layoutTypeOptions">
						{layoutTypeOptions.map((type) => (
							<option key={type} value={type} />
						))}
					</datalist>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Layout Price</label>
					<input type="text" value={formatPrice(layoutPrice)} onChange={(e) => setLayoutPrice(stripPriceFormatting(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="2,500" />
				</div>
			</div>

			<div>
				<h3 className="text-lg font-medium mb-4">Diamond Details <span className="text-red-500">*</span></h3>
				<div className="overflow-x-auto">
					<table className="w-full border-collapse border border-gray-300">
						<thead>
							<tr className="bg-gray-50">
								<th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">Shape</th>
								<th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">Total Pcs</th>
								<th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">Total Carat Weight</th>
								<th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">Dimensions</th>
								<th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">Color Range</th>
								<th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">Clarity Range</th>
								<th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">Action</th>
							</tr>
						</thead>
						<tbody>
							{layoutVariants.map((variant) => (
								<tr key={variant.id}>
									<td className="border border-gray-300 px-2 py-2">
										<input type="text" value={variant.shape} onChange={(e) => handleLayoutVariantChange(variant.id, "shape", e.target.value)} list={`shapeOptions-layout-${variant.id}`} className="cursor-pointer w-full px-2 py-1 text-sm border-0 focus:outline-none" placeholder="Type or select shape" />
										<datalist id={`shapeOptions-layout-${variant.id}`}>
											{shapeOptions.map((shape) => (
												<option key={shape} value={shape} />
											))}
										</datalist>
									</td>
									<td className="border border-gray-300 px-2 py-2">
										<input type="number" value={variant.totalPcs} onChange={(e) => handleLayoutVariantChange(variant.id, "totalPcs", e.target.value)} className="w-full px-2 py-1 text-sm border-0 focus:outline-none" placeholder="50" />
									</td>
									<td className="border border-gray-300 px-2 py-2">
										<input type="number" step="0.01" value={variant.totalCaratWeight} onChange={(e) => handleLayoutVariantChange(variant.id, "totalCaratWeight", e.target.value)} className="w-full px-2 py-1 text-sm border-0 focus:outline-none" placeholder="5.50" />
									</td>
									<td className="border border-gray-300 px-2 py-2">
										<input type="text" value={variant.dimensions} onChange={(e) => handleLayoutVariantChange(variant.id, "dimensions", e.target.value)} className="w-full px-2 py-1 text-sm border-0 focus:outline-none" placeholder="2.5x2.5x1.5 mm" />
									</td>
									<td className="border border-gray-300 px-2 py-2">
										<input type="text" value={variant.colorRange} onChange={(e) => handleLayoutVariantChange(variant.id, "colorRange", e.target.value)} list={`colorRangeOptions-layout-${variant.id}`} className="cursor-pointer w-full px-2 py-1 text-sm border-0 focus:outline-none" placeholder="Type or select color range" />
										<datalist id={`colorRangeOptions-layout-${variant.id}`}>
											{colorRanges.map((range) => (
												<option key={range} value={range} />
											))}
										</datalist>
									</td>
									<td className="border border-gray-300 px-2 py-2">
										<input type="text" value={variant.clarityRange} onChange={(e) => handleLayoutVariantChange(variant.id, "clarityRange", e.target.value)} list={`clarityRangeOptions-layout-${variant.id}`} className="cursor-pointer w-full px-2 py-1 text-sm border-0 focus:outline-none" placeholder="Type or select clarity range" />
										<datalist id={`clarityRangeOptions-layout-${variant.id}`}>
											{clarityRanges.map((range) => (
												<option key={range} value={range} />
											))}
										</datalist>
									</td>
									<td className="border border-gray-300 px-2 py-2">
										{layoutVariants.length > 1 && (
											<button onClick={() => removeLayoutVariant(variant.id)} className="cursor-pointer text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4 stroke-2" /></button>
										)}
									</td>
								</tr>
							))}
							{layoutVariants.length > 0 && (
								<tr className="bg-gray-100 font-medium">
									<td className="border border-gray-300 px-2 py-2 text-center">Total</td>
									<td className="border border-gray-300 px-2 py-2 text-center">{totalPcs}</td>
									<td className="border border-gray-300 px-2 py-2 text-center">{totalCaratWeight.toFixed(2)}</td>
									<td className="border border-gray-300 px-2 py-2"></td>
									<td className="border border-gray-300 px-2 py-2"></td>
									<td className="border border-gray-300 px-2 py-2"></td>
									<td className="border border-gray-300 px-2 py-2"></td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				<button onClick={addLayoutVariant} className="cursor-pointer mt-4 flex items-center text-primary-600 hover:text-primary-800"><Plus className="w-4 h-4 mr-2" />Add</button>

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
