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
import { t } from '@superset-ui/translation';
import { ChartMetadata, ChartPlugin } from '@superset-ui/chart';
import thumbnail from './images/thumbnail.png';
import InteractiveMapBox from './InteractiveMapBox';
import transformProps from './transformProps';
import InteractiveMapBoxControl from "./control/InteractiveMapBoxControl";
import React from 'react';

const metadata = new ChartMetadata({
  credits: ['https://www.mapbox.com/mapbox-gl-js/api/'],
  description: '',
  name: t('InteractiveMapBox'),
  thumbnail,
  useLegacyApi: true,
});

export const InteractiveMapBoxConfig = InteractiveMapBoxControl;

export default class InteractiveMapBoxChartPlugin extends ChartPlugin {
  constructor() {
    super({
      loadChart: () => InteractiveMapBox,
      loadTransformProps: () => transformProps,
      metadata,
    });
  }
}