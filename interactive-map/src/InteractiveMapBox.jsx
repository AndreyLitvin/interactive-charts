/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
/* eslint-disable sort-keys, no-magic-numbers, react/forbid-prop-types */
/* eslint-disable react/require-default-props */
import React from 'react';
import * as PropTypes from 'prop-types';
import MapGL from 'react-map-gl';
import {Editor, EditorModes} from "react-map-gl-draw";
import ViewportMercator from 'viewport-mercator-project';
import './MapBox.css';

const NOOP = () => {
};
export const DEFAULT_MAX_ZOOM = 16;
export const DEFAULT_POINT_RADIUS = 60;

const MODES = [
    { id: EditorModes.EDITING, text: 'Select and Edit Feature'},
    { id: EditorModes.DRAW_POINT, text: 'Draw Point'},
    { id: EditorModes.DRAW_PATH, text: 'Draw Polyline'},
    { id: EditorModes.DRAW_POLYGON, text: 'Draw Polygon'},
    { id: EditorModes.DRAW_RECTANGLE, text: 'Draw Rectangle'}
];

const propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    aggregatorName: PropTypes.string,
    clusterer: PropTypes.object,
    globalOpacity: PropTypes.number,
    hasCustomMetric: PropTypes.bool,
    mapStyle: PropTypes.string,
    mapboxApiKey: PropTypes.string.isRequired,
    onViewportChange: PropTypes.func,
    pointRadius: PropTypes.number,
    pointRadiusUnit: PropTypes.string,
    renderWhileDragging: PropTypes.bool,
    rgb: PropTypes.array,
    bounds: PropTypes.array,
};

const defaultProps = {
    width: 400,
    height: 400,
    globalOpacity: 1,
    onViewportChange: NOOP,
    pointRadius: DEFAULT_POINT_RADIUS,
    pointRadiusUnit: 'Pixels',
};

class InteractiveMapBox extends React.Component {
    constructor(props) {
        super(props);

        const {width, height, bounds} = this.props;
        // Get a viewport that fits the given bounds, which all marks to be clustered.
        // Derive lat, lon and zoom from this viewport. This is only done on initial
        // render as the bounds don't update as we pan/zoom in the current design.
        const mercator = new ViewportMercator({
            width,
            height,
        }).fitBounds(bounds);
        const {latitude, longitude, zoom} = mercator;

        this.state = {
            viewport: {
                longitude,
                latitude,
                zoom,
            },
            selectedMode: EditorModes.READ_ONLY,
        };
        this.renderToolbar = this.renderToolbar.bind(this);
        this.switchMode = this.switchMode.bind(this);
        this.handleViewportChange = this.handleViewportChange.bind(this);
    }

    handleViewportChange(viewport) {
        this.setState({viewport});
        // const {onViewportChange} = this.props;
        // onViewportChange(viewport);
    }

    switchMode(evt) {
        console.log(evt);
        const selectedMode = evt.target.value;
        console.log(selectedMode);
        this.setState({
            selectedMode: selectedMode === this.state.selectedMode ? null : selectedMode
        });
    };

    renderToolbar() {
        return (
            <div style={{position: 'absolute', top: 0, right: 0, maxWidth: '320px'}}>
                <select onChange={this.switchMode}>
                    <option value="">--Please choose a mode--</option>
                    {MODES.map(mode => <option value={mode.id}>{mode.text}</option>)}
                </select>
            </div>
        );
    };

    render() {
        const {
            width,
            height,
            aggregatorName,
            clusterer,
            globalOpacity,
            mapStyle,
            mapboxApiKey,
            pointRadius,
            pointRadiusUnit,
            renderWhileDragging,
            rgb,
            hasCustomMetric,
            bounds,
        } = this.props;
        const { viewport } = this.state;
        const { selectedMode } = this.state;
        const isDragging = viewport.isDragging === undefined ? false : viewport.isDragging;

        // Compute the clusters based on the original bounds and current zoom level. Note when zoom/pan
        // to an area outside of the original bounds, no additional queries are made to the backend to
        // retrieve additional data.
        const bbox = [bounds[0][0], bounds[0][1], bounds[1][0], bounds[1][1]];
        const clusters = clusterer.getClusters(bbox, Math.round(viewport.zoom));

        return (
            <MapGL
                {...viewport}
                mapStyle={'mapbox://styles/mapbox/streets-v11'}
                width={width}
                height={height}
                captureDoubleClick = {false}
                mapboxApiAccessToken={mapboxApiKey}
                onViewportChange={this.handleViewportChange}
            >
                {/*<MapGLDraw*/}
                    {/*mode={selectedMode}*/}
                {/*/>*/}
                {/*<NavigationControl captureDoubleClick = {true}/>*/}
                <Editor
                    clickRadius={12}
                    mode={this.state.selectedMode}
                />
                <div className='sidebarStyle'>
                    <div>Longitude: {this.state.viewport.longitude} | Latitude: {this.state.viewport.latitude} |
                        Zoom: {this.state.viewport.zoom}</div>
                </div>
                {this.renderToolbar()}
                {/*<ScatterPlotGlowOverlay*/}
                {/*{...viewport}*/}
                {/*isDragging={isDragging}*/}
                {/*locations={Immutable.fromJS(clusters)}*/}
                {/*dotRadius={pointRadius}*/}
                {/*pointRadiusUnit={pointRadiusUnit}*/}
                {/*rgb={rgb}*/}
                {/*globalOpacity={globalOpacity}*/}
                {/*compositeOperation="screen"*/}
                {/*renderWhileDragging={renderWhileDragging}*/}
                {/*aggregation={hasCustomMetric ? aggregatorName : null}*/}
                {/*lngLatAccessor={location => {*/}
                {/*const coordinates = location.get('geometry').get('coordinates');*/}

                {/*return [coordinates.get(0), coordinates.get(1)];*/}
                {/*}}*/}
                {/*/>*/}
            </MapGL>
        );
    }
}

InteractiveMapBox.propTypes = propTypes;
InteractiveMapBox.defaultProps = defaultProps;

export default InteractiveMapBox;
