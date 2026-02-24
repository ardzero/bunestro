// https://docs.astro.build/en/guides/images/#svgcomponent-type
import type { SvgComponent } from "astro/types";
import type { LucideIcon } from "lucide-react";
// import type * as React from 'react';

export type TLink = {
	label: string;
	href: string;
	Icon?: LucideIcon | React.ComponentType<React.HTMLAttributes<SVGElement>> | SvgComponent;
	external?: boolean;
};

export type Author = {
	name: string;
	url: string;
};
type TRobots = { index: boolean, follow: boolean }
export type TImage = {
	src: string | SvgComponent;
	alt: string;
	width?: number;
	height?: number;
};
// nav data
export type TnavData = {
	logo?: TImage;
	showTitle: boolean;
	title: string;
	links: TLink[];
	iconButtons: TLink[];
};
type TSimpleFooterText = {
	pretext: string;
	label: string;
	url: string;
};
export type TSimpleFooterData = {
	texts: TSimpleFooterText[];
	socialLinks: TLink[];
};

export type MetadataColor = {
	light: string;
	dark: string;
};
// site data types
export type TSiteData = {
	favicon: string;
	name: string;
	shortName: string;
	publisher: string;
	baseUrl: string;
	description: string;
	ogImage: {
		src: string;
		alt: string;
		width?: number;
		height?: number;
	};
	metadata_color: MetadataColor;
	author: Author;
	keywords: string[];
	robotsDefault: TRobots;
};

export type TtwitterMetaData = {
	card: 'summary_large_image' | 'summary' | 'app' | 'player'
	title: string;
	description: string;
	image: string;
	creator: string;
};
export type TMetadataIcons = {
	icon: string;
	shortcut: string;
	apple: string;
};

export type MetadataProps = {
	url?: string | URL;
	title?: string;
	description?: string;
	robots?: TRobots;
	ogTitle?: string;
	ogImage?: {
		src: string;
		alt: string;
		width?: number;
		height?: number;
	};
	keywords?: string[];
	author?: Author;
	metadataColor?: MetadataColor;
	metadataIcons?: TMetadataIcons;
	titleSuffix?: boolean;
};

export type ApplicationContextProps = {
	type?: string;
	name: string;
	aggregateRating: {
		ratingValue: string;
		reviewCount: string;
	};
	offers: {
		priceCurrency: string;
		price: string;
		priceValidUntil: string;
	};
};
