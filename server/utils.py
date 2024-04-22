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