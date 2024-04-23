import ee 

def image_to_map_id(image_name, vis_params={}):
    """
    Converts an image name to a map ID.

    Args:
        image_name (str): The name of the image.
        vis_params (dict, optional): Visualization parameters for the image. Defaults to {}.

    Returns:
        dict: A dictionary containing the map ID URL.

    Raises:
        Exception: If an error occurs during the conversion process.
    """
    try:
        ee_image = ee.Image(image_name)
        map_info = ee_image.getMapId(vis_params)
        return {
            'url': map_info['tile_fetcher'].url_format,
        }
    except Exception as e:
        return {
            'errMsg': str(e)
        }
    
def mean_image_in_collection_to_map_id(collection_name, vis_params={}, date_from=None, date_to=None):
    """
    Converts the mean image in the specified image collection to a map ID.

    Args:
        collection_name (str): The name of the image collection.
        vis_params (dict, optional): Visualization parameters for the map ID. Defaults to an empty dictionary.
        date_from (str, optional): The start date for filtering the image collection. Defaults to None.
        date_to (str, optional): The end date for filtering the image collection. Defaults to None.

    Returns:
        str: The map ID of the mean image.

    Raises:
        Exception: If any error occurs during the process.
    """
    try:
        if date_from and date_to:
            ee_collection = ee.ImageCollection(collection_name).filter(ee.Filter.date(date_from, date_to))
        else:
            ee_collection = ee.ImageCollection(collection_name)
        return image_to_map_id(ee.Image(ee_collection.mean()), vis_params)
    except Exception as e:
        raise Exception(str(e))