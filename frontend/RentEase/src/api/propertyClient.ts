import {Platform} from 'react-native';

const API_BASE_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:5000'
    : 'http://localhost:5000';

/**
 * Build Authorization + JSON headers for authenticated property API calls.
 */
const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

/**
 * Property types supported by RentEase.
 */
export type PropertyType = 'Apartment' | 'Hostel';

/**
 * Apartment BHK configurations.
 */
export type BHKConfig =
  | 'Studio'
  | '1 BHK'
  | '2 BHK'
  | '3 BHK';

/**
 * Hostel room types.
 */
export type RoomType =
  | '1 Bed'
  | '2 Bed'
  | '3 Bed'
  | '4 Bed';

/**
 * Property address.
 */
export interface PropertyAddress {
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
}

/**
 * Hostel room type configuration.
 */
export interface HostelRoomType {
  roomType: RoomType;
  count: number;
  rentPerBed: number;
  securityDeposit: number;
}

/**
 * Hostel-specific details.
 */
export interface HostelDetails {
  rooms: HostelRoomType[];
}

/**
 * Property object returned by the backend.
 */
export interface Property {
  _id: string;
  ownerUid: string;
  name: string;
  address: PropertyAddress;
  type: PropertyType;
  bhkConfig: BHKConfig | null;
  hostelDetails: HostelDetails | null;
  monthlyRent?: number;
  securityDeposit?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Data required to create a property.
 */
export interface CreatePropertyData {
  name: string;
  address: PropertyAddress;
  type: PropertyType;
  bhkConfig?: BHKConfig | null;
  hostelDetails?: HostelDetails | null;
  monthlyRent?: number;
  securityDeposit?: number;
}

/**
 * Data used to update a property.
 */
export interface UpdatePropertyData {
  name?: string;
  address?: Partial<PropertyAddress>;
  type?: PropertyType;
  bhkConfig?: BHKConfig | null;
  hostelDetails?: HostelDetails | null;
  monthlyRent?: number;
  securityDeposit?: number;
}

/**
 * POST /api/v1/properties
 *
 * Create a new property for the authenticated landlord.
 */
export const createProperty = async (
  token: string,
  property: CreatePropertyData,
): Promise<Property> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/properties`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(property),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || data.error || 'Failed to create property',
      );
    }

    return data.data;
  } catch (error) {
    console.error('API Error (createProperty):', error);
    throw error;
  }
};

/**
 * GET /api/v1/properties
 *
 * Get all properties owned by the authenticated landlord.
 */
export const getProperties = async (
  token: string,
): Promise<Property[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/properties`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || data.error || 'Failed to fetch properties',
      );
    }

    return data.data || [];
  } catch (error) {
    console.error('API Error (getProperties):', error);
    throw error;
  }
};

/**
 * GET /api/v1/properties/:id
 *
 * Get a single property by ID.
 */
export const getPropertyById = async (
  token: string,
  id: string,
): Promise<Property> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/properties/${id}`,
      {
        method: 'GET',
        headers: getAuthHeaders(token),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || data.error || 'Failed to fetch property',
      );
    }

    return data.data;
  } catch (error) {
    console.error('API Error (getPropertyById):', error);
    throw error;
  }
};

/**
 * PUT /api/v1/properties/:id
 *
 * Update an existing property.
 */
export const updateProperty = async (
  token: string,
  id: string,
  property: UpdatePropertyData,
): Promise<Property> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/properties/${id}`,
      {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify(property),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || data.error || 'Failed to update property',
      );
    }

    return data.data;
  } catch (error) {
    console.error('API Error (updateProperty):', error);
    throw error;
  }
};

/**
 * PATCH /api/v1/properties/:id/status
 *
 * Activate or deactivate a property.
 */
export const togglePropertyStatus = async (
  token: string,
  id: string,
  isActive: boolean,
): Promise<Property> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/properties/${id}/status`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(token),
        body: JSON.stringify({isActive}),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          data.error ||
          'Failed to update property status',
      );
    }

    return data.data;
  } catch (error) {
    console.error('API Error (togglePropertyStatus):', error);
    throw error;
  }
};

/**
 * DELETE /api/v1/properties/:id
 *
 * Permanently delete a property from MongoDB.
 */
export const deleteProperty = async (
  token: string,
  id: string,
): Promise<void> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/properties/${id}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          data.error ||
          'Failed to delete property',
      );
    }
  } catch (error) {
    console.error('API Error (deleteProperty):', error);
    throw error;
  }
};